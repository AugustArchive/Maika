import { ISchema } from '@maika.xyz/kotori';

export class GuildSchema extends ISchema {
    constructor() {
        super('guilds', {
            guildID: {},
            prefix: {},
            starboard: {},
            autoroles: {},
            selfroles: {}
        });
    }
};