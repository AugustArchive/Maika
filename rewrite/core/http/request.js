const fetch        = require('node-fetch');
const { METHODS }  = require('http');
const HTTPResponse = require('./response');
const { URL }      = require('url');
const FormData     = require('form-data');

module.exports = class HTTPRequest {
    /**
     * Construct a new HTTPRequest instance
     * 
     * @param {string} uri The URL to request
     * @param {HTTPRequestOptions} options The other options
     */
    constructor(uri, options) {
        this.uri = new URL(uri);
        if (!METHODS.includes(options.method))
            throw new TypeError(`Method "${options.method}" is not supported.`);
        this.method = options.method || "GET";
        this.body = options.body || null;
        this.headers = options.headers || {};
        this.redirects = options.redirects || 20;

        this.headers['User-Agent'] = 'Maika (https://github.com/auguwu/Maika)';
    }

    /**
     * Execute the request
     * 
     * @returns {Promise<HTTPResponse>} The response
     */
    async execute() {
        const resp = await fetch(this.uri.toString(), {
            method: this.method,
            body: this.body,
            headers: this.headers,
            followCount: this.redirects
        });
        return new HTTPResponse(resp);
    }

    /**
     * Adds a query (`?x=y&z=a`)
     * 
     * @param {string} queryOrName The query name
     * @param {string} [value] The value
     * @returns {HTTPRequest} The request
     */
    addQuery(queryOrName, value) {
        if (typeof queryOrName === 'object')
            for (const [x, y] of Object.entries(queryOrName))
                this.uri.searchParams.append(x, y);
        else if (typeof name === 'string' && value)
            this.uri.searchParams.append(name, value);
        else
            throw new TypeError('The "query" paramater must be an Object or a field.');

        return this;
    }

    /**
     * Adds an HTTP header
     * 
     * @param {string} header The header name
     * @param {string} [val] The value
     * @returns {HTTPRequest} The request
     */
    addHeader(header, val) {
        if (typeof header === 'object')
            for (const [h, value] of Object.entries(header))
                this.headers[h] = value;
        else if (typeof header === 'string' && val)
            this.headers[header] = val;
        else
            throw new TypeError('The "headers" field must be an Object or a field.');

        return this;
    }

    /**
     * Attach anything to the body
     * 
     * @param {any} args The attachment to add
     * @returns {HTTPRequest} The request
     */
    attach(...args) {
        if (!this.body || !(this.body instanceof FormData))
            this.body = new FormData();
        
        if (typeof args[0] === 'object')
            for (const [key, value] of Object.entries(args[0]))
                this.attach(key, value);
        else
            this.body.append(...args);

        return this;
    }

    /**
     * Send a body
     * 
     * @param {FormData | object} data The data to send
     * @param {boolean} [raw=false] If the body is an instance of `FormData`, it will be raw.
     * @returns {HTTPRequest} The request
     */
    send(data, raw = false) {
        if (data instanceof FormData)
            raw = true;

        if (!raw && data !== null && typeof data === 'object') {
            const h = this.headers['content-type'];
            if (h)
                if (/application\/json/gi.test(h))
                    body = JSON.stringify(body);
            else {
                this.addHeader('content-type', 'application/json');
                body = JSON.stringify(body);
            }
        }

        this.body = body;
        return this;
    }

    /**
     * Static `GET` request
     * 
     * @param {string} uri The uri
     * @param {HTTPRequestOptions} options The request options
     * @returns {HTTPRequest}
     */
    static get(uri, options) {
        return new HTTPRequest(uri, {
            method: 'GET',
            ...options
        });
    }

    /**
     * Static `POST` request
     * 
     * @param {string} uri The uri
     * @param {HTTPRequestOptions} options The options
     * @returns {HTTPRequest}
     */
    static post(uri, options) {
        return new HTTPRequest(uri, {
            method: "POST",
            ...options
        });
    }
};

/**
 * @typedef {Object} HTTPRequestOptions The http request options
 * @prop {"GET" | "POST" | "PATCH" | "DELETE"} [method="GET"] The method
 * @prop {{ [x: string]: any; }} [body] A body to send (POST only)
 * @prop {{ [x: string]: string; }} [query] Any queries to use
 * @prop {{ [x: string]: string }} [headers] Any headers to use
 * @prop {number} [redirects=20] The redirects to use (Default: 20)
 */