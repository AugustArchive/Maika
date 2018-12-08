module.exports = class HTTPResponse {
    /**
     * Construct a new HTTPResponse singleton
     * 
     * @param {import('node-fetch').Response} res The node-fetch response
     */
    constructor(res) {
        this.resp = res;
    }

    /**
     * Get a JSON response
     * 
     * @returns {ResponseBody} The body from the `node-fetch` class
     */
    async json() {
        const resp = await this.resp.buffer();
        const headers = {};
        for(const [h, v] of resp.headers.entries())
            headers[h] = v;
        const res = {
			status: response.status,
			statusText: response.statusText,
			headers,
			url: response.url,
			ok: response.ok,
			raw,
			get text() {
				return raw.toString();
			},
			get body() {
				if (/application\/json/gi.test(headers['content-type'])) {
					try {
						return JSON.parse(raw.toString());
					} catch (err) {
						return raw.toString();
					}
				} else {
					return raw;
				}
			}
        };
        if (!resp.ok) {
            const error = new Error(`${res.status}: ${res.statusText}`);
            Object.assign(error, res);
            throw error;
        }
        return res;
    }
};

/**
 * @typedef {object} ResponseBody The body that was from node-fetch
 * @prop {string} status The status
 * @prop {string} statusText The status text
 * @prop {{ [x: string]: string; }} headers The headers
 * @prop {string} url The url that was executed
 * @prop {boolean} ok If the request was ok
 * @prop {string} text The raw text version
 * @prop {string} body The body
 */