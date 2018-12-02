const fetch       = require('node-fetch');
const FormData    = require('form-data');
const { METHODS } = require('http');
const { URL }     = require('url');

module.exports = class HTTPRequest {
    /**
     * The http request class
     * - Credit: [dragonfire535](https://github.com/dragonfire535/node-superfetch)
     * 
     * @param {RequestOptions} options The request options
     */
    constructor(options) {
        if (!options.url)
            throw new SyntaxError("The \"url\" option must be defined.");

        this.url = new URL(options.url);
        this.method = options.method ? options.method : 'GET';
        if (!METHODS.includes(this.method))
            throw new TypeError(`Method "${this.method}" is not supported.`);
        this.headers = options.headers || {};
        this.body = options.body || null;
        this.redirects = (typeof options.redirects === 'undefined' ? 20 : options.redirects);
        this.agent = options.agent || null;
    }

    /**
     * Executes the request
     * 
     * @protected
     * @returns {Promise<Response>}
     */
    async execute() {
        const req = await fetch(this.url.toString(), {
            method: this.method,
            headers: this.headers,
            follow: this.redirects,
            body: this.body,
            agent: this.agent
        });
        const raw = await req.buffer();
        const headers = {};
        for (let [h, v] of req.headers.entries())
            headers[h] = v;
        const response = {
            status: req.status,
            statusText: req.statusText,
            headers,
            url: req.url,
            ok: response.ok,
            raw,
            get text() { return raw.toString(); },
            get body() {
                if (/application\/json/gi.text(headers['content-type']))
                    try {
                        return JSON.parse(raw.toString())
                    } catch (_) {
                        return raw.toString();
                    }
                else
                    return raw;
            }
        };
        if (!req.ok) {
            Object.assign(new Error(`${response.status}: ${response.statusText}`), response);
            throw new Error(`${response.status}: ${response.statusText}`);
        }
        return response;
    }

    /**
     * The resolver and rejector
     * 
     * @param {Response} resolve The resolver
     * @param {never} reject The rejector
     * @returns {Promise<Response>}
     */
    then(resolve, reject) { return this.execute().then(resolve).catch(reject); }

    /**
     * The catcher for Promises
     * 
     * @param {never} reject The rejector
     * @returns {Promise<Response>}
     */
    catch(reject) { return this.then(null, reject); }

    /**
     * The end function
     * 
     * @param {(error: Error | null, response: Response) => void} callback The callback
     * @returns {Promise<Response>} The response
     */
    end(callback) { return this.then(res => callback ? callback(null, res) : res, e => callback ? callback(e, e.status ? e : null) : e); }

    /**
     * Adds any queries to the URL
     * 
     * @param {string} queryOrName The query name
     * @param {string} value The value of the query
     * @returns {HTTPRequest}
     */
	query(queryOrName, value) {
		if (typeof queryOrName === 'object') {
			for (const [param, val] of Object.entries(queryOrName)) this.url.searchParams.append(param, val);
		} else if (typeof queryOrName === 'string' && value) {
			this.url.searchParams.append(queryOrName, value);
		} else {
			throw new TypeError('The "query" parameter must be either an object or a query field.');
		}
		return this;
	}

    /**
     * Automatically set the headers
     * 
     * @param {string} headersOrName The header value
     * @param {string} value The header value
     * @returns {HTTPRequest}
     */
	set(headersOrName, value) {
		if (typeof headersOrName === 'object') {
			for (const [header, val] of Object.entries(headersOrName)) this.headers[header] = val;
		} else if (typeof headersOrName === 'string' && value) {
			this.headers[headersOrName] = value;
		} else {
			throw new TypeError('The "headers" parameter must be either an object or a header field.');
		}
		return this;
	}

    /**
     * Append anything to the body
     * 
     * @param  {...any} args The arguments to add
     * @returns {HTTPRequest}
     */
	attach(...args) {
		if (!this.body || !(this.body instanceof FormData)) this.body = new FormData();
		if (typeof args[0] === 'object') {
			for (const [key, val] of Object.entries(args[0])) this.attach(key, val);
		} else {
			this.body.append(...args);
		}
		return this;
	}

    /**
     * Send a body
     * 
     * @param {any} body The body to send
     * @param {boolean} [raw=false] The raw value
     * @returns {HTTPRequest}
     */
	send(body, raw = false) {
		if (body instanceof FormData) raw = true;
		if (!raw && body !== null && typeof body === 'object') {
			const header = this.headers['content-type'];
			if (header) {
				if (/application\/json/gi.test(header)) body = JSON.stringify(body);
			} else {
				this.set('content-type', 'application/json');
				body = JSON.stringify(body);
			}
		}
		this.body = body;
		return this;
	}

    /**
     * Set the redirect value
     * 
     * @param {number} amount The amount to redirect?
     * @returns {HTTPRequest}
     */
	redirects(amount) {
		if (typeof amount !== 'number') throw new TypeError('The "amount" parameter must be a number.');
		this.redirectCount = amount;
		return this;
	}

    /**
     * Manually set the agent
     * 
     * @param {import('http').Agent | string} agent The agent
     * @returns {HTTPRequest}
     */
	agent(agent) {
		this.agent = agent;
		return this;
    }
    
    /**
     * Statically GET a url
     * 
     * @param {string} url The URL
     * @param {...RequestOptions} options The request options
     * @returns {HTTPRequest}
     */
    static get(url, options) { return new HTTPRequest({ url, method: 'GET', ...options }); }

    /**
     * Statically POST a url
     * 
     * @param {string} url The url
     * @param {RequestOptions} options The request options
     * @returns {HTTPRequest}
     */
    static post(url, options) { return new HTTPRequest({ url, method: 'POST', ...options }); }
};

/**
 * @typedef {Object} RequestOptions
 * @prop {string} url The URL
 * @prop {"GET" | "POST" | "PUT" | "DELETE" | "PATCH"} [method] The uppercase method (Default: GET)
 * @prop {{ [x: string]: string }} [headers] The headers
 * @prop {any} [body] The body to send (using the POST method)
 * @prop {number} [redirects=20] The number of redirects
 * @prop {import('http').Agent | string} [agent] The user agent
 */
/**
 * @typedef {Object} Response
 * @prop {number} status The response status
 * @prop {string} statusText The status text
 * @prop {{[x: string]: string}} headers The response headers
 * @prop {string} url The url
 * @prop {boolean} ok If the request was a 200
 * @prop {Buffer} raw The raw buffer
 * @prop {string} text The string of text
 * @prop {ResponseBody} body The response body
 */
/** @typedef {object | string | Buffer} ResponseBody */