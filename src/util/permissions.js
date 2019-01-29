const { Constants } = require('eris');
/** @type {{ [x: string]: string; }} */
const nodes = {
    createInstantInvite: 'Create Instant Invite',
    banMembers: 'Ban Members',
    kickMembers: 'Kick Members',
    administrator: 'Administrator',
    manageChannels: 'Manage Channels',
    manageGuild: 'Manage Guild',
    addReactions: 'Add Reactions',
    viewAuditLogs: 'View Audit Logs',
    voicePrioritySpeaker: 'Priority Speaker',
    readMessages: 'Read Messages',
    sendMessages: 'Send Messages',
    sendTTSMessages: 'Send TTS Messages',
    manageMessages: 'Manage Messages',
    embedLinks: 'Embed Links',
    attachFiles: 'Attach Files',
    readMessageHistory: 'Read Message History',
    mentionEveryone: 'Mention Everyone',
    externalEmojis: 'External Emojis',
    voiceConnect: 'Connect to VC',
    voiceSpeak: 'Speak in VC',
    voiceMuteMembers: 'Mute Members in VC',
    voiceDeafenMembers: 'Deafen Members in VC',
    voiceUseVAD: 'Use VAD',
    changeNickname: 'Change Nickname',
    manageNicknames: 'Manage Nicknames',
    manageRoles: 'Manage Roles',
    manageWebhooks: 'Manage Webhooks',
    manageEmojis: 'Manage Emojis'
};

module.exports = class PermissionUtil {
    /**
     * Gathers the permission by bitcoding it
     * @param {number|string|number[]} permission The bitfield permission area
     * @returns {number} The permission bitcoded
     */
    static gather(permission) {
        if (!permission)
            return this.gather(0);

        if (typeof permission === 'number' && permission >= 0)
            return permission;

        if (permission instanceof Array)
            return permission.map(p => this.gather(p)).reduce((previous, p) => previous | p, 0);

        if (typeof permission === 'string')
            return Constants.Permissions[permission];

        throw new RangeError('Invalid permission bitfield.');
    }

    /**
     * If a user has permission to do anything
     * @param {import('eris').Member} member The member
     * @param {import('../core/internal/plugin').Permission} permission The humanized permission node
     * @returns {boolean} If the user has it or not
     */
    static has(member, permission) {
        if (member.permission.has(permission))
            return true;
        else
            return false;
    }

    /**
     * Humanizes the permission node
     * @param {import('../core/internal/plugin').Permission} permission The permission to humanize
     * @returns {string} The humanized permission
     */
    static humanize(permission) {
        return nodes[permission];
    }
}