const Event = require('../core/event');

module.exports = new Event({
    event: 'guildMemberAdd',
    emitter: 'on',
    run: (client, guild, member) => {
        const autoroles = client.settings.get(guild, 'autoroles', []);
        if (autoroles.length > 0)
            autoroles.forEach(s => member.addRole(s, 'Maika Autorole System'));
    }
});