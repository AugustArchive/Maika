import { ISchema } from '@maika.xyz/kotori';

export class StarModel extends ISchema {
    constructor() {
        super({
            name: 'stars',
            definitions: {
                guildID: {
                    type: String,
                    default: undefined
                },
                messageID: {
                    type: String,
                    default: undefined
                },
                embed: {},
                channelID: {
                    type: String,
                    default: undefined
                },
                stars: {
                    type: Number,
                    default: 0
                }
            }
        });
    }
};