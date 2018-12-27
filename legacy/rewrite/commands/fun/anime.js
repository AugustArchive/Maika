const Command = require('../../core/command');
const { AniList } = require('@maika.xyz/miu');
const { TITLE } = require('../../util/embed-titles');

const anilist = new AniList("Maika/DiscordBot (https://github.com/MaikaBot/Maika)");

module.exports = new Command({
    command: 'anime',
    aliases: ['animu'],
    description: 'Searches the AniList.co API for anime for you senpai',
    usage: '<search>',
    category: { name: 'Fun', emoji: Command.emojis.Fun },
    run: async (client, msg) => {
        if (!msg.args[0])
            return msg.reply('Unknown `<search>` argument.');

        const search = await anilist.getAnime(msg.args.join(' '));
        return msg.embed({
            title: `${search.title} (${search.id})`,
            description: search.description,
            fields: [
                {
                    name: `${TITLE} Genres`,
                    value: search.genres.join(', '),
                    inline: true
                },
                {
                    name: `${TITLE} Score`,
                    value: search.score,
                    inline: true
                },
                {
                    name: `${TITLE} Episodes`,
                    value: search.episodes,
                    inline: true
                },
                {
                    name: `${TITLE} Main Characters`,
                    value: search.characters,
                    inline: false
                }
            ],
            color: client.color
        });
    }
});