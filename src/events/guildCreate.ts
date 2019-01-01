import { Client, Event } from '@maika.xyz/kotori';
import { Guild } from 'eris';
import { stripIndents } from 'common-tags';
import EmbedTitles from '../util/embed';
import Constants from '../util/constants';

export class GuildCreatedEvent extends Event {
    constructor(client: Client) {
        super(client, { event: 'guildCreate', emitter: "client" });
    }

    async run(guild: Guild) {
        const g = this.client.database.getSchema('guilds');
        await g.create({ guildID: guild.id });
        this.client.createMessage((process.env.LOG_CHANNEL) as string, {
            embed: {
                title: `[ Guild Joined ]`,
                description: `I have joined **${guild.name}**!`,
                fields: [
                    {
                        name: `${EmbedTitles.TITLE} ID`, value: guild.id, inline: false
                    },
                    {
                        name: `${EmbedTitles.TITLE} Members`, value: guild.memberCount.toLocaleString(), inline: true
                    },
                    {
                        name: `${EmbedTitles.TITLE} Channels`, value: stripIndents`
                            ${EmbedTitles.DESCRIPTION} **${guild.channels.filter(s => s.type === 0).length}** text channels
                            ${EmbedTitles.DESCRIPTION} **${guild.channels.filter(s => s.type === 2).length}** voice channels
                            ${EmbedTitles.DESCRIPTION} **${guild.channels.filter(s => s.type === 4).length}** category channels
                        `, inline: true
                    },
                    {
                        name: `${EmbedTitles.TITLE} Shard`, value: `**${guild.shard.id}**/${this.client.shards.size}`, inline: true
                    }
                ],
                color: Constants.color
            }
        });
    }
};