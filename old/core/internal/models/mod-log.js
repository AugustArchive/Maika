const { User } = require('eris'); 

module.exports = class ModLogEntry {
    /**
     * Construct a new mod log entry singleton.
     * @param {import('../client')} client The client
     * @param {ModLogEntryInfo} info The information
     */
    constructor(client, info) {
        this.client = client;
        this.action = info.action;
        this.victim = info.victim;
        this.moderator = info.moderator;
        this.guild = info.guild;
        this.reason = info.reason || 'No reason provided.';
    }

    /**
     * Gets the victim
     * @returns {import('eris').User} The instance of the user
     */
    getVictim() {
        if (this.victim instanceof User)
            return this.victim;
        else if (typeof this.victim === 'string') {
            const user = this.client.users.get(this.victim);
            return user;
        } else
            return null;
    }

    /**
     * Posts the modlog embed
     * @returns {ModLogEntry} The instance to chain
     */
    async post() {
        const settings = await this.client.settings.get(this.guild.id);

        if (settings['modlog'].enabled || this.getChecks(settings)) {
            const channel = this.guild.channels.get(settings['modlog'].channelID);
            channel.createMessage({
                embed: {
                    title: this.humanizeAction(),
                    fields: [
                        {
                            name: 'Victim', value: (() => {
                                const victim = this.getVictim();
                                return `${victim.username}#${victim.discriminator} (**${victim.id}**)`;
                            })(), inline: true
                        },
                        {
                            name: 'Moderator', value: `${this.moderator.username}#${this.moderator.discriminator} (**${this.moderator.id}**)`, inline: true
                        },
                        {
                            name: 'Reason', value: this.reason, inline: true
                        }
                    ],
                    color: this.client.color,
                    footer: { text: this.client.getFooter() }
                }
            });
        }
    }

    /**
     * Gets the checks of the mod log system
     * @param {import('../../settings/guild-settings').Settings} settings The settings
     * @returns {boolean}
     */
    getChecks(settings) {
        return this.guild.channels.has(settings['modlog'].channelID) && this.guild.channels.get(settings['modlog'].channelID).permissionsOf(this.client.user.id).has('sendMessages');
    }

    /**
     * Humanize the action string
     * @returns {string}
     */
    humanizeAction() {
        const action = this.action;
        return action === 'BAN'? 'Ban': action === 'KICK'? 'Kick': action === 'MUTE'? 'Muted': action === 'UNMUTED'? 'Unmuted': 'Unbanned';
    }

    /**
     * JSONify the mod log entry
     */
    toJSON() {
        return {
            victim: this.getVictim(),
            moderator: this.moderator,
            action: this.action,
            guild: this.guild,
            reason: this.reason
        };
    }

    /**
     * Stringify the mod log entry
     * @returns {string}
     */
    toString() {
        return `ModLogEntry<${this.action}>`;
    }
};

/**
 * @typedef {Object} ModLogEntryInfo
 * @prop {"BAN" | "KICK" | "MUTE" | "UNMUTE" | "UNBAN"} action The action
 * @prop {User|string} victim The victim
 * @prop {User} moderator The moderator who banned the victim
 * @prop {import('eris').Guild} guild The guild that the victim was banned
 * @prop {string} [reason='No reason provided.'] The reason
 */