const Plugin                                             = require('../structures/plugin');
const { osu: OsuClient, kitsu: KitsuClient, dateformat } = require('../deps');
const fetch                                              = require('node-fetch');
const { USER_AGENT: UserAgent }                          = require('../util/constants');
const { stripIndents }                                   = require('common-tags');

const kitsu             = new KitsuClient();
const osu               = new OsuClient();
const fetchOptions      = {
    method: 'GET',
    headers: {
        'User-Agent': UserAgent
    }
};

module.exports = new Plugin({
    name: 'Search',
    embeded: ':mag: Search',
    visible: true,
    enabled: false,
    commands: [
        {
            command: 'anime',
            description: 'Searches anime from Kitsu',
            usage: '<anime>',
            aliases: ['animu'],
            async run(bot, msg) {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: You must provide an anime title.`);

                const anime = await kitsu.anime(msg.args.slice(0).join(' '));
                return await msg.embed({
                    title: `${anime.titles.romaji} (${anime.titles.japanese}) | ${anime.titles.english}`,
                    description: anime.synopsis > 2000 ? `${anime.synopsis.substr(0, 2000 - 3)}...` : anime.synopsis,
                    url: anime.url,
                    color: bot.constants.SearchColours.KITSU,
                    fields: [
                        {
                            name: 'Type', value: anime.subType, inline: true
                        },
                        {
                            name: 'Episode(s)', value: anime.episodeCount, inline: true
                        },
                        {
                            name: 'Started', value: anime.startDate, inline: true
                        },
                        {
                            name: 'Ended', value: anime.endDate || 'In Progress', inline: true
                        },
                        {
                            name: 'Age Rating', value: anime.ageRating, inline: true
                        },
                        {
                            name: 'Score', value: anime.averageRating, inline: true
                        },
                        {
                            name: 'Popularity Rank', value: anime.popularityRank, inline: true
                        },
                        {
                            name: 'NSFW', value: anime.nsfw, inline: true
                        }
                    ]
                });
            }
        },
        {
            command: 'azur-lane',
            description: 'Searches the Azur Lane API for a ship',
            usage: '<ship>',
            aliases: ['shipgirl'],
            async run(bot, msg) {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: Provide a shipgirl to search! .w.`);

                try {
                    const req = await fetch(`https://al-shipgirls.pw/shipyard/ship_info_detailed?search=${msg.args[0]}`, fetchOptions);
                    const res = await req.json();
                    if (!res.length)
                        return msg.reply(`**${msg.sender.username}**: No results found.`);
                    const data = res[0].item;
                    return await msg.embed({
                        title: `${data.names.en} (${data.class} Class)`,
                        color: bot.constants.SearchColours.AZUR_LANE,
                        url: data.page_url,
                        thumbnail: { url: data.icon },
                        footer: { text: `Ship ${data.id}` },
                        fields: [
                            {
                                name: 'Construction Time', value: data.construction_time, inline: true
                            },
                            {
                                name: 'Rarity', value: data.rarity, inline: true
                            },
                            {
                                name: 'Nationality', value: data.nationality, inline: true
                            },
                            {
                                name: 'Type', value: data.type, inline: true
                            },
                            {
                                name: 'Health', value: `${data.base.health} (${data.max.health} Max Health)`, inline: true
                            },
                            {
                                name: 'Armour', value: data.base.armor, inline: true
                            },
                            {
                                name: 'Reload', value: `${data.base.reload} (${data.max.reload} Max)`, inline: true
                            },
                            {
                                name: 'Firepower', value: `${data.base.firepower} (${data.max.firepower} Max)`, inline: true
                            },
                            {
                                name: 'Torpedo', value: `${data.base.torpedo} (${data.max.torpedo} Max)`, inline: true
                            },
                            {
                                name: 'Evasion', value: `${data.base.evasion} (${data.max.evasion} Max)`, inline: true
                            },
                            {
                                name: 'Anti Air', value: `${data.base.anti_air} (${data.max.anti_air} Max)`, inline: true
                            },
                            {
                                name: 'Anti Sub', value: `${data.base.anti_sub} (${data.max.anti_sub} Max)`, inline: true
                            },
                            {
                                name: 'Aviation', value: `${data.base.aviation} (${data.max.aviation} Max)`, inline: true
                            },
                            {
                                name: 'Oil Cost', value: `${data.base.oil_cost} (${data.max.oil_cost} Max)`, inline: true
                            },
                            {
                                name: 'Equipment', value: stripIndents`
                                    ${data.equipment[0].equippable} (${data.equipment[0].efficiency})
                                    ${data.equipment[1].equippable} (${data.equipment[1].efficiency})
                                    ${data.equipment[2].equippable} (${data.equipment[2].efficiency})
                                `, inline: true
                            }
                        ]
                    });
                } catch(ex) {
                    return msg.reply(bot.constants.Strings.ERROR(msg, ex));
                }
            }
        },
        {
            command: 'github',
            description: 'Searches the GitHub API for users or repositories',
            usage: '<user|repository> <user or repo_author> <repo_name>',
            aliases: ['git'],
            async run(bot, msg) {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: You must provide a subcommand. (\`user\` or \`repository\`)`);
                if (!['user', 'repository'].includes(msg.args[0]))
                    return msg.reply(`**${msg.sender.username}**: You must provide a valid subcommand.`);
                
                switch (msg.args[0]) {
                    case "user": {
                        if (!msg.args[1])
                            return msg.reply(`**${msg.sender.username}**: You must provide a user`);

                        try {
                            const req = await fetch(`https://api.github.com/users/${msg.args[1]}`);
                            const res = await req.json();

                            await msg.embed({
                                title: `User ${res.login} (${res.id})`,
                                description: res.bio,
                                url: res.html_url,
                                thumbnail: { url: res.avatar_url },
                                color: bot.constants.SearchColours.GITHUB,
                                fields: [
                                    {
                                        name: 'Company', value: res.company, inline: true
                                    },
                                    {
                                        name: 'Website URL', value: res.blog || 'None', inline: true
                                    },
                                    {
                                        name: 'Followers', value: res.followers, inline: true
                                    },
                                    {
                                        name: 'Following', value: res.following, inline: true
                                    }
                                ]
                            });
                        } catch(ex) {
                            return msg.reply(bot.constants.Strings.ERROR(msg, ex));
                        }
                    } break;
                    case "repository": {
                        if (!msg.args[1])
                            return msg.reply(`**${msg.sender.username}**: No repository author argument called.`);
                        if (!msg.args[2])
                            return msg.reply(`**${msg.sender.username}**: No repository name argument called.`);

                        try {
                            const req = await fetch(`https://api.github.com/repos/${encodeURIComponent(msg.args[1])}/${encodeURIComponent(msg.args[2])}`, fetchOptions);
                            const res = await req.json();

                            await msg.embed({
                                title: `${res.name} (${res.id})`,
                                description: res.description,
                                color: bot.constants.SearchColours.GITHUB,
                                url: res.html_url,
                                fields: [
                                    {
                                        name: 'Statistics', value: stripIndents`
                                            :star: **Stars**: ${res.stargazers_count}
                                            :eyes: **Watchers**: ${res.watchers_count}
                                            :spoon: **Forks**: ${res.forks_count}
                                        `, inline: true
                                    },
                                    {
                                        name: 'Language', value: res.language || '???', inline: true
                                    },
                                    {
                                        name: 'Archived', value: (res.archived ? 'Yes' : 'No'), inline: true
                                    },
                                    {
                                        name: 'License', value: res.license.name || 'None', inline: true
                                    },
                                    {
                                        name: 'Default Branch Name', value: res.default_branch, inline: true
                                    },
                                    {
                                        name: 'Open Issues', value: res.open_issues, inline: true
                                    }
                                ]
                            });
                        } catch(ex) {
                            return msg.reply(bot.constants.Strings.ERROR(msg, ex));
                        }
                    } break;
                }
            }
        },
        {
            command: 'jisho',
            description: 'Searches the Jisho API for english to romanji.',
            usage: '<word>',
            aliases: ['romanji'],
            async run(bot, msg) {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: You must provide an English word.`);
                
                try {
                    const req = await fetch(`http://jisho.org/api/v1/search/words?keyword=${msg.args[0]}`, fetchOptions);
                    const res = await req.json();

                    if (!res.data.length)
                        return msg.reply(`**${msg.sender.username}**: Nothing was found.`);

                    const data = res.data[0];
                    return await msg.reply(stripIndents`
                        **${msg.args[0]} -> ${data.japanese[0].word || data.japanese[0].reading}**
                        ${data.senses[0].english_definitions.join(', ')}
                    `);
                } catch(ex) {
                    return msg.reply(bot.constants.Strings.ERROR(msg, ex));
                }
            }
        },
        {
            command: 'manga',
            description: 'Searches manga from Kitsu',
            usage: '<manga>',
            aliases: [],
            async run(bot, msg) {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: You must provide an manga to search!`);

                const manga = await kitsu.manga(msg.args.slice(0).join(' '));
                return await msg.embed({
                    title: `${manga.titles.japanese} (${manga.titles.romaji}) | ${manga.titles.english}`,
                    description: manga.synopsis > 2000 ? `${manga.synopsis.substr(0, 2000 - 3)}` : manga.synopsis,
                    url: manga.url,
                    color: bot.constants.SearchColours.KITSU,
                    fields: [
                        {
                            name: 'Type', value: manga.subType, inline: true
                        },
                        {
                            name: 'Started', value: manga.startDate, inline: true
                        },
                        {
                            name: 'Ended', value: manga.endDate || 'In Progress', inline: true
                        }
                    ]
                });
            }
        },
        {
            command: 'mdn',
            description: 'Searches the Mozilla Developer Network for any JavaScript prototypes',
            usage: '<prototype>',
            aliases: ['mozilla-developer-network'],
            async run(bot, msg) {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: You must add an JavaScript prototype argument.`);

                let search = msg.args[0];
                search = search.replace(/#/g, '.prototype.');

                try {
                    const req = await fetch(`https://developer.mozilla.org/en-US/search.json?q=${search}&locale=en-US&highlight=false`, fetchOptions);
                    const res = await req.json();

                    if (!res.documents.length)
                        return msg.reply(`**${msg.sender.username}**: No JavaScript prototype found.`);

                    const data = res.documents[0];
                    return await msg.embed({
                        title: data.title,
                        url: data.url,
                        description: data.excerpt,
                        color: bot.constants.SearchColours.MDN
                    });
                } catch(ex) {
                    return msg.reply(bot.constants.Strings.ERROR(msg, ex));
                }
            }
        },
        {
            command: 'osu',
            description: "Searches osu!users and beatmaps",
            usage: '<"user" | "beatmap"> <id | user> [gamemode]',
            aliases: ['osu!'],
            async run(bot, msg) {
            if (!msg.args[0])
                return msg.reply(`**${msg.sender.username}**: You must provide an subcommand: \`user\` or \`beatmap\``);
            if (!['user', 'beatmap'].includes(msg.args[0]))
                return msg.reply(`**${msg.sender.username}**: Invalid subcommand.`);

            switch (msg.args[0].toLowerCase()) {
                case "user": {
                    if (!msg.args[1])
                        return msg.reply(`**${msg.sender.username}**: You must provide a username.`);
                    if (!msg.args[2])
                        return msg.reply(`**${msg.sender.username}**: You must provide a gamemode. (\`standard\`, \`taiko\`, \`catch\`, or \`mania\`)`);
                    if (!['standard', 'catch', 'taiko', 'mania'].includes(msg.args[2]))
                        return msg.reply(`**${msg.sender.username}**: Invalid gamemode.`);

                    switch(msg.args[2]) {
                        case "standard": {
                            const user = await osu.user(msg.args[1], 0);
                            msg.embed({
                                title: `User ${user.username} (${user.id})`,
                                description: `Level ${user.level} | ${user.country}`,
                                color: bot.constants.SearchColours.OSU,
                                fields: [
                                    {
                                        name: 'Joined osu! At', value: user.joinedAt, inline: true
                                    },
                                    {
                                        name: 'Counts', value: `- **300**: ${user.counts[300]}\n- **100**: ${user.counts[100]}\n- **50**: ${user.counts[50]}`, inline: true
                                    },
                                    {
                                        name: 'Play Count', value: user.playcount, inline: true
                                    },
                                    {
                                        name: 'Scores', value: `- **Ranked**: ${user.scores.ranked}\n- **Total**: ${user.scores.total}`, inline: true
                                    },
                                    {
                                        name: 'PP', value: `- **Raw**: ${user.pp}\n- **Country**: ${user.countryRank}`, inline: true
                                    },
                                    {
                                        name: 'Count Ranks', value: `- **SSH (with Hidden/Flashlight)**: ${user.count_ranks.SSH}\n- **SS**: ${user.count_ranks.SS}\n- **S (with Hidden/Flashlight)**: ${user.count_ranks.SH}\n- **S**: ${user.count_ranks.S}\n- **A**: ${user.count_ranks.A}`, inline: true
                                    },
                                    {
                                        name: 'Accuracy', value: user.accuracy
                                    }
                                ]
                            });
                        } break;
                        case "taiko": {
                            const user = await osu.user(msg.args[1], 1);
                            msg.embed({
                                title: `User ${user.username} (${user.id})`,
                                description: `Level ${user.level} | ${user.country}`,
                                color: bot.constants.SearchColours.OSU,
                                fields: [
                                    {
                                        name: 'Joined osu! At', value: user.joinedAt, inline: true
                                    },
                                    {
                                        name: 'Counts', value: `- **300**: ${user.counts[300]}\n- **100**: ${user.counts[100]}\n- **50**: ${user.counts[50]}`, inline: true
                                    },
                                    {
                                        name: 'Play Count', value: user.playcount, inline: true
                                    },
                                    {
                                        name: 'Scores', value: `- **Ranked**: ${user.scores.ranked}\n- **Total**: ${user.scores.total}`, inline: true
                                    },
                                    {
                                        name: 'PP', value: `- **Raw**: ${user.pp}\n- **Country**: ${user.countryRank}`, inline: true
                                    },
                                    {
                                        name: 'Count Ranks', value: `- **SSH (with Hidden/Flashlight)**: ${user.count_ranks.SSH}\n- **SS**: ${user.count_ranks.SS}\n- **S (with Hidden/Flashlight)**: ${user.count_ranks.SH}\n- **S**: ${user.count_ranks.S}\n- **A**: ${user.count_ranks.A}`, inline: true
                                    },
                                    {
                                        name: 'Accuracy', value: user.accuracy
                                    }
                                ]
                            });
                        } break;
                        case "catch": {
                            const user = await osu.user(msg.args[1], 2);
                            msg.embed({
                                title: `User ${user.username} (${user.id})`,
                                description: `Level ${user.level} | ${user.country}`,
                                color: bot.constants.SearchColours.OSU,
                                fields: [
                                    {
                                        name: 'Joined osu! At', value: user.joinedAt, inline: true
                                    },
                                    {
                                        name: 'Counts', value: `- **300**: ${user.counts[300]}\n- **100**: ${user.counts[100]}\n- **50**: ${user.counts[50]}`, inline: true
                                    },
                                    {
                                        name: 'Play Count', value: user.playcount, inline: true
                                    },
                                    {
                                        name: 'Scores', value: `- **Ranked**: ${user.scores.ranked}\n- **Total**: ${user.scores.total}`, inline: true
                                    },
                                    {
                                        name: 'PP', value: `- **Raw**: ${user.pp}\n- **Country**: ${user.countryRank}`, inline: true
                                    },
                                    {
                                        name: 'Count Ranks', value: `- **SSH (with Hidden/Flashlight)**: ${user.count_ranks.SSH}\n- **SS**: ${user.count_ranks.SS}\n- **S (with Hidden/Flashlight)**: ${user.count_ranks.SH}\n- **S**: ${user.count_ranks.S}\n- **A**: ${user.count_ranks.A}`, inline: true
                                    },
                                    {
                                        name: 'Accuracy', value: user.accuracy
                                    }
                                ]
                            });
                        } break;
                        case "mania": {
                            const user = await osu.user(msg.args[1], 3);
                            msg.embed({
                                title: `User ${user.username} (${user.id})`,
                                description: `Level ${user.level} | ${user.country}`,
                                color: bot.constants.SearchColours.OSU,
                                fields: [
                                    {
                                        name: 'Joined osu! At', value: user.joinedAt, inline: true
                                    },
                                    {
                                        name: 'Counts', value: `- **300**: ${user.counts[300]}\n- **100**: ${user.counts[100]}\n- **50**: ${user.counts[50]}`, inline: true
                                    },
                                    {
                                        name: 'Play Count', value: user.playcount, inline: true
                                    },
                                    {
                                        name: 'Scores', value: `- **Ranked**: ${user.scores.ranked}\n- **Total**: ${user.scores.total}`, inline: true
                                    },
                                    {
                                        name: 'PP', value: `- **Raw**: ${user.pp}\n- **Country**: ${user.countryRank}`, inline: true
                                    },
                                    {
                                        name: 'Count Ranks', value: `- **SSH (with Hidden/Flashlight)**: ${user.count_ranks.SSH}\n- **SS**: ${user.count_ranks.SS}\n- **S (with Hidden/Flashlight)**: ${user.count_ranks.SH}\n- **S**: ${user.count_ranks.S}\n- **A**: ${user.count_ranks.A}`, inline: true
                                    },
                                    {
                                        name: 'Accuracy', value: user.accuracy
                                    }
                                ]
                            });
                        } break;
                    }
                } break;
                case "beatmap": {
                    if (!msg.args[1])
                        return msg.reply(`**${msg.sender.username}**: You must provide the beatmap's id.\nExample: <https://osu.ppy.sh/beatmapsets/567324/#osu/1201636> -> \`${msg.prefix}osu beatmap 1201636\``);
                    
                        const beatmap = await osu.beatmap(msg.args[1]);
                        msg.embed({
                            title: `${beatmap.artist} — ${beatmap.title} (${beatmap.id})`,
                            description: `${beatmap.approved} | ${beatmap.difficulty} :star:`,
                            color: bot.constants.SearchColours.OSU,
                            fields: [
                                {
                                    name: 'Difficulty', value: `- **Approach Rate**: ${beatmap.ar}\n- **Circle Size**: ${beatmap.cs}\n- **Overall Difficulty**: ${beatmap.od}\n- **HP Drain**: ${beatmap.hd}`, inline: true
                                },
                                {
                                    name: 'Gamemode', value: beatmap.mode, inline: true
                                },
                                {
                                    name: 'Creator', value: `${beatmap.creator} (\`${msg.prefix}osu user ${beatmap.creator} [standard|taiko|mania|catch]\`)`, inline: true
                                },
                                {
                                    name: 'Beats per Minute', value: beatmap.bpm, inline: true
                                },
                                {
                                    name: 'Source', value: beatmap.source, inline: true
                                },
                                {
                                    name: 'Genre', value: beatmap.genre, inline: true
                                },
                                {
                                    name: 'Language', value: beatmap.language, inline: true
                                },
                                {
                                    name: 'Plays', value: `- **Passed**: ${beatmap.plays.passed}\n- **Overall**: ${beatmap.plays.played}`, inline: true
                                },
                                {
                                    name: 'Max Combo', value: beatmap.maxCombo, inline: true
                                }
                            ]
                        });
                    } break;
                } break;
            }
        },
        {
            command: 'reddit',
            description: 'Searches the Reddit API for a user or a subreddit',
            usage: '<user|subreddit> <user or subreddit>',
            aliases: ['r/'],
            async run(bot, msg) {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: No "user" or "subreddit" argument called.`);
                if (!['user', 'subreddit'].includes(msg.args[0]))
                    return msg.reply(`**${msg.sender.username}**: Invalid subcommand.`);

                switch (msg.args[0]) {
                    case "user": {
                        if (!msg.args[1])
                            return msg.reply(`**${msg.sender.username}**: No username argument was called.`);

                        try {
                            const req = await fetch(`https://reddit.com/u/${msg.args[1]}/about.json`);
                            const res = await req.json();

                            const { data } = res;
                            if (data.hide_from_robots)
                                return msg.reply(`**${msg.sender.username}**: User \`${msg.args[0]}\` is hidden from bots.`);

                            await msg.embed({
                                title: `u/${data.name} (${data.id})`,
                                color: bot.constants.SearchColours.REDDIT,
                                url: `https://reddit.com/u/${msg.args[0]}`,
                                fields: [
                                    {
                                        name: 'Karma', value: data.link_karma + data.comment_karma, inline: true
                                    },
                                    {
                                        name: 'Created At', value: dateformat(data.created_utc * 1000, 'mm/dd/yyyy hh:MM:ss TT'), inline: true
                                    },
                                    {
                                        name: 'Gold?', value: data.is_gold ? 'Yes' : 'No', inline: true
                                    },
                                    {
                                        name: 'Verified?', value: data.verified ? 'Yes' : 'No', inline: true
                                    }
                                ]
                            });
                        } catch(ex) {
                            return msg.reply(bot.constants.Strings.ERROR(msg, ex));
                        }
                    } break;
                    case "subreddit": {
                        if (!msg.args[1])
                            return msg.reply(`**${msg.sender.username}**: No \`subreddit\` argument passed.`);

                        try {
                            const req = await fetch(`https://reddit.com/r/${msg.args[1]}/about.json`, fetchOptions);
                            const res = await req.json();

                            if (!('display_name' in res.data))
                                return msg.reply(`**${msg.sender.username}**: Unable to find the subreddit.`);

                            await msg.embed({
                                title: res.data.display_name,
                                color: bot.constants.SearchColours.REDDIT,
                                description: res.data.public_description,
                                url: `https://reddit.com/r/${msg.args[0]}`,
                                thumbnail: { url: res.data.icon_img }
                            });
                        } catch(ex) {
                            return msg.reply(bot.constants.Strings.ERROR(msg, ex));
                        }
                    } break;
                }
            }
        },
        {
            command: 'steam',
            description: 'Searches the Steam API for a user or game',
            usage: '<user|game> <game or user>',
            aliases: [],
            async run(bot, msg) {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: No \`user\` or \`game\` argument called.`);
                if (!['user', 'game'].includes(msg.args[0]))
                    return msg.reply(`**${msg.sender.username}**: Invalid subcommand.`);

                switch (msg.args[0]) {
                    case "user": {
                        if (!msg.args[1])
                            return msg.reply(`**${msg.sender.username}**: No username was provided.`);

                        try {
                            const req = await fetch(`https://api.alexflipnote.xyz/steam/user/${msg.args[1]}`, fetchOptions);
                            const res = await req.json();

                            await msg.embed({
                                title: `User ${res.id.customurl}`,
                                color: bot.constants.SearchColours.STEAM,
                                thumbnail: { url: res.avatars.avatar },
                                url: res.profile.url,
                                fields: [
                                    {
                                        name: 'VAC Banned', value: (res.profile.vacbanned ? 'Yes' : 'No'), inline: true
                                    },
                                    {
                                        name: 'Joined Steam', value: res.profile.timecreated, inline: true
                                    },
                                    {
                                        name: 'Current Status', value: res.profile.state
                                    }
                                ]
                            });
                        } catch(ex) {
                            return msg.reply(bot.constants.Strings.ERROR(msg, ex));
                        }
                    } break;
                    case "game": {
                        if (!msg.args[0])
                            return msg.reply(`**${msg.sender.username}**: No game id argument passed.`);

                        try {
                            const id = await steamSearch(msg.args.slice(0).join(' '));
                            if (!id)
                                return msg.reply(`**${msg.sender.username}**: No game was found.`);
                            const data = await steamGame(id);
                            const current = (data.price_overview ? `$${data.price_overview.final / 100}` : 'Free');
                            const original = (data.price_overview ? `$${data.price_overview.initial / 100}` : 'Free');
                            const price = current === original ? current : `~~${original}~~ ${current}`;
                            const platforms = [];
                            if (data.platforms) {
                                if (data.platforms.windows)
                                    platforms.push('Windows');
                                if (data.platforms.mac)
                                    platforms.push('macOS');
                                if (data.platforms.linux)
                                    platforms.push('Linux');
                            }

                            await msg.embed({
                                title: data.name,
                                url: `http://store.steampowered.com/app/${data.steam_appid}`,
                                thumbnail: { url: data.header_image },
                                color: bot.constants.SearchColours.STEAM,
                                fields: [
                                    {
                                        name: 'Price', value: price, inline: true
                                    },
                                    {
                                        name: 'Metascore', value: (data.metacritic ? data.metacritic.score : 'Unknown'), inline: true
                                    },
                                    {
                                        name: 'Recommendations', value: (data.recommendations ? data.recommendations.total : 'Unknown'), inline: true
                                    },
                                    {
                                        name: 'Platforms', value: platforms.join(', ') || 'None', inline: true
                                    },
                                    {
                                        name: 'Release Date', value: (data.release_date ? data.release_date.date : 'In Development'), inline: true
                                    },
                                    {
                                        name: 'DLC', value: (data.dlc ? data.dlc.length : 0), inline: true
                                    },
                                    {
                                        name: 'Developers', value: (data.developers ? data.developers.join(', ') || 'None' : '???'), inline: true
                                    },
                                    {
                                        name: 'Publishers', value: (data.publishers ? data.publishers.join(', ') || 'None' : '???'), inline: true
                                    }
                                ]
                            });
                        } catch(ex) {
                            return msg.reply(bot.constants.Strings.ERROR(msg, ex));
                        }
                    } break;
                }
            }
        },
        {
            command: 'vocadb',
            description: 'Searches the VocaDB API of your query',
            usage: '<query>',
            aliases: ['vocaloid'],
            async run(bot, msg) {
                if (!msg.args[0])
                    return msg.reply(`**${msg.sender.username}**: No \`vocaloid\` song argument passed.`);

                try {
                    const req = await fetch(`http://vocadb.net/api/songs?query=${msg.args.slice(0).join(' ')}&maxResults=1&sort=FavoritedTimes&perferAccurateMatches=true&nameMatchMode=Words&fields=ThumbUrl,Lyrics`, fetchOptions);
                    const res = await req.json();

                    if (!res.items.length)
                        return msg.reply(`**${msg.sender.username}**: No result found.`);
                    const data = res.items[0];
                    return await msg.embed({
                        title: data.name,
                        url: `http://vocadb.net/S/${data.id}`,
                        description: data.lyrics.length ? (data.lyrics[0].value > 2000 ? `${data.lyrics[0].value}...` : data.lyrics[0].value) : 'No lyrics avaliable at this moment',
                        color: bot.constants.SearchColours.VOCADB,
                        fields: [
                            {
                                name: 'Artist', value: data.artistString, inline: false
                            },
                            {
                                name: 'Published Date', value: dateformat(data.publishDate, 'mm/dd/yyyy'), inline: true
                            }
                        ]
                    });
                } catch(ex) {
                    return msg.reply(bot.constants.Strings.ERROR(msg, ex));
                }
            }
        }
    ]
});

const steamSearch = async (query) => {
    const request = await fetch(`https://store.steampowered.com/api/storesearch?cc=us&l=en&term=${query}`, fetchOptions);
    const response = await request.json();

    if (!response.items.length)
        return null;

    return response.items[0].id;
}

const steamGame = async game => {
    const request = await fetch(`https://store.steampowered.com/api/appdetails?appids=${game}`, fetchOptions);
    const response = await request.json();

    return response[game.toString()].data;
};