module.exports = class MaikaEvent {
    /**
     * The Maika event class
     * 
     * @param {EventInfo} info The event info
     */
    constructor(info) {
        this.event   = info.event;
        this.emitter = info.emitter;
        this.run     = info.run;
    }
};

/** @typedef {"ready" | "disconnect" | "callCreate" | "callRing" | "callDelete" | "callUpdate" | "channelCreate" | "channelDelete" | "channelPinUpdate" | "channelRecipientAdd" | "channelRecepientRemove" | "channelUpdate" | "friendSuggestionCreate" | "friendSuggestionDelete" | "guildAvaliable" | "guildBanAdd" | "guildBanRemove" | "guildDelete" | "guildUnavaliable" | "guildCreate" | "guildEmojisUpdate" | "guildMemberAdd" | "guildMemberChunk" | "guildMemberRemove" | "guildMemberUpdate" | "guildRoleCreate" | "guildRoleDelete" | "guildRoleUpdate" | "guildUpdate" | "hello" | "messageCreate" | "messageDeleteBulk" | "messageReactionRemoveAll" | "messageDeleteBulk" | "messageReactionAdd" | "messageReactionRemove" | "messageUpdate" | "presenceUpdate" | "rawWS" | "unknown" | "relationshipAdd" | "relationshipRemove" | "relationshipUpdate" | "typingStart" | "unavaliableGuildCreate" | "userUpdate" | "voiceChannelJoin" | "voiceChannelLeave" | "voiceChannelSwitch" | "voiceStateUpdate" | "warn" | "debug" | "shardDisconnect" | "error" | "shardPreReady" | "connect" | "shardReady" | "shardResume"} Emittable */
/**
 * @typedef {object} EventInfo
 * @prop {Emittable} event The event name
 * @prop {"on" | "once"} emitter The emitter
 * @prop {(bot: import('./client'), ...args: any[]) => void} run The run function
 */