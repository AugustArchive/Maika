const { truncate } = require('../../util/array');

module.exports = class RESTClient {
    /**
     * Create a new REST client
     * @param {import('./client')} client The client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Resolves a Discord role
     * @param {string} query The role name/mention/id
     * @param {import('eris').Guild} guild The guild
     * @returns {Promise<import('eris').Role>}
     */
    getRole(query, guild) {
        return new Promise((resolve, reject) => {
            if (/^\d+$/.test(query)) {
                const role = guild.roles.get(query);
                if (role)
                    return resolve(query);
            } else if (/<@%(\d+)>$/.test(query)) {
                const match = query.match(/^<@&(\d+)>$/);
                const role  = guild.roles.get(match[1]);
                if (role)
                    return resolve(query);
            } else {
                const roles = guild.roles.filter((role) => role.name.toLowerCase().includes(query.toLowerCase()));
                if (roles.length > 0) return resolve(roles[0]);
            }
            reject();
        });
    }

    /**
     * Resolves a Discord user
     * @param {string} query The query
     * @returns {Promise<import('eris').User>}
     */
    getUser(query) {
        return new Promise((resolve, reject) => {
            if (/^\d+$/.test(query)) {
                const user = this.client.users.get(query);
                if (user) return resolve(user);
            } else if (/^<@!?(\d+)>$/.test(query)) {
                const match = query.match(/^<@!?(\d+)>$/);
                const user = this.client.users.get(match[1]);
                if (user) return resolve(user);
            } else if (/^(.+)#(\d{4})$/.test(query)) {
                const match = query.match(/^(.+)#(\d{4})$/);
                const users = this.client.users.filter((user) => user.username === match[1] && Number(user.discriminator) === Number(match[2]));
                if (users.length > 0) return resolve(users[0]);
            } else {
                const users = this.client.users.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()));
                if (users.length > 0) return resolve(users[0]);
            }
            reject();
        });
    }

    /**
     * Resolves a Discord guild
     * @param {string} query The query
     * @returns {import('eris').Guild}
     */
    getGuild(query) {
        return new Promise((resolve, reject) => {
            if (/^\d+$/.test(query)) {
                const guild = this.this.client.guilds.get(query);
                if (guild) return resolve(guild);
            } else {
                const guilds = this.this.client.guilds.filter((guild) => guild.name.toLowerCase().includes(query.toLowerCase()));
                if (guilds.length > 0) return resolve(guilds[0]);
            }

            reject();
        });
    }

    /**
     * Resolves a Discord "text"/"voice"/"category" channel
     * @param {string} query The query
     * @param {import('eris').Guild} guild The guild
     * @returns {Promise<import('eris').TextChannel|import('eris').VoiceChannel|import('eris').CategoryChannel>}
     */
    getChannel(query, guild) {
        return new Promise((resolve, reject) => {
            if (/^\d+$/.test(query)) {
                if (guild) {
                    if (!guild.channels.has(query)) reject();
                    resolve(guild.channels.get(query));
                } else {
                    const channel = channel in this.client.channelGuildMap && this.client.guilds.get(this.client.channelGuildMap[query]).channels.get(query);
                    if (channel) return resolve(channel);
                }
            } else if (/^<#(\d+)>$/.test(channel)) {
                const match = query.match(/^<#(\d+)>$/);
                if (guild) {
                    if (!guild.channels.has(match[1])) reject();
                    resolve(guild.channels.get(match[1]));
                } else {
                    const channel = match[1] in this.client.channelGuildMap && this.client.guilds.get(this.client.channelGuildMap[match[1]]).channels.get(query);
                    if (channel) return resolve(channel);
                }
            } else if (guild) {
                const channel = guild.channels.filter((channel) => channel.name.toLowerCase().includes(query.toLowerCase()));
                if (channel.length > 0) return resolve(channel[0]);
            } 
      
            reject();
        });
    }

    /**
     * Resolves a Discord message
     * @param {{ channelID: string; messageID: string; }} options The options OwO
     * @returns {Promise<import('eris').Message>}
     */
    getMessage(options) {
        return new Promise(async(resolve, reject) => {
            try {
                const message = await this.client.getMessage(options.channelID, options.messageID);
                resolve(message);
            } catch(ex) {
                reject('Unknown Message ID.');
            }
        });
    }

    /**
     * Shows a list of Discord emojis
     * @param {import('eris').Guild} guild The guild
     * @param {number} [len] The length
     * @returns {string}
     */
    getGuildEmojis(guild, len = 50) {
        return truncate(guild.emojis.map(i => `<${i.animated ? 'a' : ''}:${i.name}:${i.id}>`), len).join(', ');
    }

    /**
     * Resolves a Discord member
     * @param {string} query The query
     * @param {import('eris').Guild} guild The guild
     * @param {boolean} [noGuessing] If u wanna guess or not
     * @returns {Promise<import('eris').Member>}
     */
    getMember(query, guild, noGuessing = false) {
        return new Promise((resolve, reject) => {
            if (/^\d+$/.test(query)) {
                const user = guild.members.get(query);
                if (user) return resolve(user);
            } else if (/^<@!?(\d+)>$/.test(query)) {
                const match = query.match(/^<@!?(\d+)>$/);
                const user = guild.members.get(match[1]);
                if (user) return resolve(user);
            } else if (/^(.+)#(\d{4})$/.test(query)) {
                const match = query.match(/^(.+)#(\d{4})$/);
                const users = guild.members.filter((user) => user.user.username === match[1] && Number(user.user.discriminator) === Number(match[2]));
                if (users.length > 0) return resolve(users[0]);
            } else if (!noGuessing) {
                const users = guild.members.filter((user) => user.user.username.toLowerCase().includes(query.toLowerCase()));
                if (users.length > 0) return resolve(users[0]);
            }
            reject();
        });
    }
}