'use strict';

const { Event } = require('../core');
module.exports = class MessageEvent extends Event {
    constructor(client) {
        super(client, 'messageCreate');
    }

    emit(msg) {
        this.client.manager.processor.process(msg);
    }
}