import { Client, Event } from '@maika.xyz/kotori';
import { Message, TextChannel } from 'eris';
import { MessageEmbed } from '@maika.xyz/eris-utils';
import Constants from '../util/constants';

export class MessageReactionAddEvent extends Event {
    constructor(client: Client) {
        super(client, { event: 'messageReactionAdd', emitter: 'client' });
    }

    async run(message: Message, emoji: { name: string, id: string }, userID: string) {
        const channel = (message.channel) as TextChannel;
        channel.getMessage(message.id).then(async (mes: Message) => {
            if (!mes)
                return;
            if (mes.channel.type !== 0)
                return;

            const channel = (message.channel) as TextChannel;
            const coll = this.client.database.getCollection('guilds');
            const guild = coll.findOne({ guildID: channel.guild.id });

            if (!guild || !guild['starboard'].enabled)
                return;
            if (emoji.name !== guild['starboard'].emoji.split(':')[0])
                return;
            if (/maika.disableStars/g.test(channel.topic ? channel.topic.toLowerCase() : ''))
                return;

            const starboard = (channel.guild.channels.has(guild['starboard'].channelID) ? channel.guild.channels.get(guild['starboard'].channelID) : undefined) as TextChannel;
            if (!starboard)
                return;

            const threshold = mes.reactions[guild['starboard'].emoji] ? mes.reactions[guild['starboard'].emoji].count : 0;
            if (threshold < guild['starboard'].threshold)
                return;
            
            const star = await this.client.database.getCollection('stars').findOne({ messageID: mes.id });
            let embed = new MessageEmbed()
                .setColor(Constants.color)
                .setAuthor(`[ User ${mes.author.username} ]`, mes.author.avatarURL || mes.author.defaultAvatarURL)
                .setTimestamp(new Date(mes.timestamp));

            if (mes.embeds.length > 0 && 'url' in mes.embeds[0])
                embed.setURL((mes.embeds[0].url) as string);
            if (mes.embeds.length > 0 && 'title' in mes.embeds[0])
                embed.setTitle((mes.embeds[0].title) as string);
            if (mes.embeds.length > 0 && 'description' in mes.embeds[0])
                embed.setDescription((mes.embeds[0].description) as string);
            
            const emote = guild['starboard'].emoji.split(':')[1] ? `<:${guild['starboard'].emoji}>` : guild['starboard'].emoji;
            if (star) {
                starboard
                    .getMessage(star.boardID)
                    .then(async (b) => {
                        this.client.database.getCollection('stars').updateOne({ messageID: mes.id }, 
                        { 
                            $set: { stars: threshold } 
                        });
                        if (!b)
                            starboard.createMessage({
                                content: `${threshold} ${emote} in ${mes.channel.mention} (\`${mes.id}\`)`,
                                embed: embed.build()
                            });
                        else
                            starboard.editMessage(b.id, {
                                content: `${threshold} ${emote} in ${mes.channel.mention} (\`${mes.id}\`)`,
                                embed: embed.build()
                            });
                    });
            } else {
                const message = await starboard.createMessage({
                    content: `${threshold} ${emote} in ${mes.channel.mention} (\`${mes.id}\`)`,
                    embed: embed.build()
                });
                const s = this.client.database.getSchema('stars');
                const q = s.create({
                    guildID: channel.guild.id,
                    channelID: mes.channel.id,
                    stars: threshold,
                    embed: embed.build(),
                    boardChannelID: message.id
                });
            }
        });
    }
};