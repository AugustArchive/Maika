const { Collection } = require('eris');
const Command = require('./command');

module.exports = class MaikaPlugin {
    /**
     * Create a new Maika plugin instance
     * @param {PluginMeta} info The plugin meta information
     */
    constructor(info) {
        this.name = info.name;
        this.description = info.description;
        this.visible = info.visible || true;
        /** @type {Collection<import('./command')>} */
        this.commands = new Collection();
        this.file = null;
        this.disabled = info.disabled || false;

        info.commands.forEach((command) => {
            if (command.disabled)
                return;

            if (this.commands.has(command.command))
                return;

            this.commands.set(info.commands[i].command, new Command(info.commands[i]));
        });
    }

    /**
     * Sets the file for reloading, loading, & unloading
     * @param {string} file The file from the file system
     * @returns {MaikaPlugin} Instance to chain
     */
    setFile(file) {
        this.file = file;
        return this;
    }

    /**
     * See if the command exist
     * @param {string} name The command name
     * @returns {boolean}
     */
    hasCommand(name) {
        return this.commands.filter(c => c.command === name || c.aliases.includes(name)).length > 0;
    }

    /**
     * Gets the command instance
     * @param {string} name The command name
     * @returns {import('./command')[]} The command instance
     */
    getCommand(name) {
        return this.commands.filter(c => c.command === name || c.aliases.includes(name))[0];
    }
}

/**
 * @typedef {Object} PluginMeta
 * @prop {string} name The plugin name
 * @prop {string} description The plugin description
 * @prop {boolean} [visible=true] Should the plugin be visiable to all users?
 * @prop {import('./command').CommandInfo[]} commands The array of commands to add
 * @prop {boolean} [disabled=false] If the plugin should be disabled
 */

/**
 * @typedef {(client: import('./client'), ctx: import('./context')) => IPromisedCommand} CommandRun
 * @typedef {Promise<void>} IPromisedCommand
 * @typedef {String[]} CommandAlias
 * @typedef {"createInstantInvite" | "kickMembers" | "banMembers" | "administrator" | "manageChannels" | "manageGuild" | "addReactions" | "viewAuditLogs" | "voicePrioritySpeaker" | "readMessages" | "sendMessages" | "sendTTSMessages" | "manageMessages" | "embedLinks" | "attachFiles" | "readMessageHistory" | "mentionEveryone" | "externalEmojis" | "voiceConnect" | "voiceSpeak" | "voiceMuteMembers" | "voiceDeafenMembers"| "voiceUseVAD" | "changeNickname" | "manageNicknames" | "manageRoles" | "manageWebhooks" | "manageEmojis"} Permission
 */