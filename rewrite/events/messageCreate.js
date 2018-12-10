const Event = require('../core/event');

module.exports = new Event({
    event: "messageCreate",
    emitter: "on",
    run: (client, msg) => client
        .registry
        .processor
        .process(msg)
});