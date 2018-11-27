module.exports = class Router {
    /**
     * The router interface
     * 
     * @param {import('../../src/structures/client')} bot The bot client
     * @param {string} route The route prefix
     */
    constructor(bot, route) {
        this.bot    = bot;
        this.route  = route;
        this.router = require('express').Router();
        
        this.run();
    }

    run() {}
};