const Event = require('../structures/event');

module.exports = class MessageCreatedEvent extends Event {
    constructor(bot) {
        super(bot, {
            event: "messageCreate",
            emitter: "on"
        });
    }

    run(msg) {
        this
            .bot
            .registry
            .handle(msg);
    }
};