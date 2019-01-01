import { ISchema } from '@maika.xyz/kotori';

export class GuildSchema extends ISchema {
    constructor() {
        super({
            name: 'guilds',
            definitions: {
                guildID: {
                    type: String,
                    default: null
                },
                prefix: {
                    type: String,
                    default: (process.env.MAIKA_PREFIX) as string
                },
                starboard: {
                    emoji: {
                        type: String,
                        default: '⭐'
                    },
                    starThreshold: {
                        type: Number,
                        default: 1
                    },
                    channelID: {
                        type: String,
                        default: null
                    },
                    enabled: {
                        type: Boolean,
                        default: false
                    }
                },
                modlog: {
                    channelID: {
                        type: String,
                        default: null
                    },
                    enabled: {
                        type: Boolean,
                        default: false
                    }
                },
                blacklist: []
            }
        });
    }
};