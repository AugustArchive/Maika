module.exports = class Router {
    /**
     * Create a new Router instance
     * @param {import('../../src/core/internal/client')} client The client
     * @param {string} route The route prefix
     */
    constructor(client, route) {
        this.client = client;
        this.route = route;
        this.router = require('express').Router();

        this.run();
    }

    /**
     * Place all router getters/setters/patchers/etc here
     * @returns {void} nOOP
     */
    run() {
        throw new SyntaxError(`Router ${this.constructor.name} didn't place any routers in the run function.`);
    }
};