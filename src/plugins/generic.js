const { Plugin } = require('../core');

module.exports = new Plugin({
    name: 'generic',
    description: 'Useful yet "generic" commands.',
    commands: [
        {
            command: 'plugins',
            description: (client) => `Shows the current plugins ${client.user.username} has.`,
            run: (client, ctx) => ctx.embed({
                description: `**Current Plugins**: ${client.manager.plugins.map(s => s.name).join(', ')}`,
                color: client.color,
                footer: { text: client.getFooter() }
            })
        }
    ]
});