const { stripIndents } = require('common-tags');
const { Event }        = require('@maika.xyz/kotori');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, 'ready');
    }

    emit() {
        if (!this.client.user.bot) process.exit();

        this.client.logger.info(stripIndents`
            ${this.client.user.tag} has logged in.

            Guilds  : ${this.client.guilds.size.toLocaleString()}
            Users   : ${this.client.users.size.toLocaleString()}
            Channels: ${Object.keys(this.client.channelGuildMap).length.toLocaleString()}
            Commands: ${this.client.manager.commands.size} Commands
            Locales : ${this.client.languages.locales.size} Locales
        `);
        for (const shard of this.client.ws.shards.map(s => s)) {
            this.client.logger.info(`  Setting game status for shard #${shard.id}...`);
            this.client.editStatus('online', {
                name: `${this.client.prefix}help | Shard #${shard.id}`,
                type: 0
            });
        }
    }
}