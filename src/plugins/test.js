'use strict';

const { Plugin } = require('../core');

module.exports = new Plugin({
    name: 'test',
    description: 'A test plugin, what did you expect?',
    commands: [
        {
            command: 'debug',
            description: 'A debug command, how can I put it into words?',
            run: (client, ctx) => ctx.reply(`${client.user.username} is working!`)
        }
    ]
});