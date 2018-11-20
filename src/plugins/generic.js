const Plugin = require('../structures/plugin');

module.exports = new Plugin({
    name: 'Generic',
    visible: true,
    commands: [{
        command: 'test',
        description: 'Test the plugin',
        usage: '<...args>',
        category: 'Generic',
        aliases: ['debug'],
        run: (msg) => {
            if (!msg.args[0])
                return msg.send(`**${msg.sender.username}**: Provide some arguments`);
            else
                return msg.send(`**${msg.sender.username}**: ${msg.args.join(' ')}`);
        }
    }]
});