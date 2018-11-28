/*
 * Copyright (c) 2018-present auguwu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { trim } = require('./array');

module.exports = class FinderUtil {
    /**
     * The finder util finds guilds, users, channels, or roles.
     * 
     * @param {import('../structures/client')} bot The this.bot client
     */
    constructor(bot) {
        this.bot = bot;
    }

    /**
     * Resolves a Discord role
     * 
     * @param {string} query The role name/mention/id
     * @param {import('eris').Guild} guild The guild
     * @returns {Promise<import('eris').Role>}
     */
    role(query, guild) {
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
                const roles = guild.roles.filter(
                    (role) => role.name.toLowerCase().includes(query.toLowerCase())
                );
                if (roles.length > 0)
                    return resolve(roles[0]);
            }

            reject();
        });
    }

    /**
     * Resolves a Discord user
     * 
     * @param {string} query The query
     * @returns {Promise<import('eris').User>}
     */
    user(query) {
        return new Promise((resolve, reject) => {
            if (/^\d+$/.test(query)) {
                const user = this.bot.users.get(query);
                if (user) return resolve(user);
            } else if (/^<@!?(\d+)>$/.test(query)) {
                const match = query.match(/^<@!?(\d+)>$/);
                const user = this.bot.users.get(match[1]);
                if (user) return resolve(user);
            } else if (/^(.+)#(\d{4})$/.test(query)) {
                const match = query.match(/^(.+)#(\d{4})$/);
                const users = this.bot.users.filter((user) => user.username === match[1] && Number(user.discriminator) === Number(match[2]));
                if (users.length > 0) return resolve(users[0]);
            } else {
                const users = this.bot.users.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()));
                if (users.length > 0) return resolve(users[0]);
            }
            reject();
        });
    }

    /**
     * Resolves a Discord guild
     * 
     * @param {string} query The query
     * @returns {import('eris').Guild}
     */
    guild(query) {
        return new Promise((resolve, reject) => {
            if (/^\d+$/.test(query)) {
                const guild = this.this.bot.guilds.get(query);
                if (guild) return resolve(guild);
            } else {
                const guilds = this.this.bot.guilds.filter((guild) => guild.name.toLowerCase().includes(query.toLowerCase()));
                if (guilds.length > 0) return resolve(guilds[0]);
            }

            reject();
        });
    }

    /**
     * Resolves a Discord "text"/"voice"/"category" channel
     * 
     * @param {string} query The query
     * @param {import('eris').Guild} guild The guild
     * @returns {Promise<import('eris').TextChannel|import('eris').VoiceChannel|import('eris').CategoryChannel>}
     */
    channel(query, guild) {
        return new Promise((resolve, reject) => {
            if (/^\d+$/.test(query)) {
              if (guild) {
                if (!guild.channels.has(query)) reject();
                resolve(guild.channels.get(query));
              } else {
                const channel = channel in this.bot.channelGuildMap && this.bot.guilds.get(this.bot.channelGuildMap[query]).channels.get(query);
                if (channel) return resolve(channel);
              }
            } else if (/^<#(\d+)>$/.test(channel)) {
              const match = query.match(/^<#(\d+)>$/);
              if (guild) {
                if (!guild.channels.has(match[1])) reject();
                resolve(guild.channels.get(match[1]));
              } else {
                const channel = match[1] in this.bot.channelGuildMap && this.bot.guilds.get(this.bot.channelGuildMap[match[1]]).channels.get(query);
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
     * 
     * @param {{ channelID: string; messageID: string; }} options The options OwO
     * @returns {Promise<import('eris').Message>}
     */
    message(options) {
        return new Promise(async(resolve, reject) => {
            try {
                const message = await this.bot.getMessage(options.channelID, options.messageID);
                resolve(message);
            } catch(ex) {
                reject('Unknown Message ID.');
            }
        });
    }

    /**
     * Shows a list of Discord emojis
     * 
     * @param {import('eris').Guild} guild The guild
     * @param {number} [len] The length
     * @returns {string}
     */
    emojis(guild, len = 50) {
        return trim(guild.emojis.map(i => `<${i.animated ? 'a' : ''}:${i.name}:${i.id}>`), len).join(', ');
    }

    /**
     * Resolves a Discord member
     * 
     * @param {string} query The query
     * @param {import('eris').Guild} guild The guild
     * @param {boolean} [noGuessing] If u wanna guess or not
     * @returns {Promise<import('eris').Member>}
     */
    member(query, guild, noGuessing = false) {
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
};