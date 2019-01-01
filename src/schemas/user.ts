import { ISchema } from '@maika.xyz/kotori';

export class UserSchema extends ISchema {
    constructor() {
        super({
            name: 'users',
            definitions: {
                userID: {
                    type: String,
                    default: null
                },
                coins: {
                    type: Number,
                    default: 0
                },
                profile: {
                    description: {
                        type: String,
                        default: 'No description set.'
                    },
                    social: {
                        osu: {
                            type: String,
                            default: null
                        },
                        twitter: {
                            type: String,
                            default: null
                        },
                        steam: {
                            type: String,
                            default: null
                        },
                        github: {
                            type: String,
                            default: null
                        },
                        twitch: {
                            type: String,
                            default: null
                        }
                    }
                }
            }
        });
    }
};