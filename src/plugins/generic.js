const { stripIndents } = require('common-tags');
const { elipisis: shorten } = require('../util/string');
const { Plugin } = require('../core');
const axios = require('axios');

module.exports = new Plugin({
    name: 'generic',
    description: 'Useful yet "generic" commands.',
    commands: [
        {
            command: 'about',
            description: (client) => `Shows information about me, ${client.user.username}!`,
            aliases: ['me'],
            run: (client, ctx) => ctx.embed({
                description: stripIndents`
                    :wave: Ohayo! My name is ${client.user.username} and I am an multipurpose Discord bot!
                    :pencil: Features:
                    - Music (generic I know)
                    - Automod (Protect your server without use of commands!)
                    and more to come!
                `,
                color: client.color,
                footer: {
                    text: client.getFooter(),
                    icon_url: client.user.avatarURL
                }
            })
        },
        {
            command: 'changelog',
            description: (client) => stripIndents`
                **Grabs the last 10 commits from ${client.user.username}'s repository!**
                If no arguments were provided, it would default as \`10\`.
            `,
            usage: '[limit]',
            aliases: ['commits'],
            run: async (client, ctx) => {
                let limit;
                if (!ctx.args[0])
                    limit = 10;
                else
                    limit = Number(ctx.args[0]);

                const res = await axios.get('https://api.github.com/repos/MaikaBot/Maika/commits');
                const commits = res.data.slice(0, limit || 10);
                ctx.embed({
                    author: {
                        name: `[Maika:master] Last ${limit} commits:`,
                        icon_url: client.user.avatarURL
                    },
                    description: commits.map(commit => {
                        const hash = `[\`${commit.sha.slice(0, 7)}\`](${commit.html_url})`;
                        return `${hash} ${shorten(commit.commit.message.split('\n')[0], 50)} - ${commit.author.login}`;
                    }).join('\n'),
                    color: client.color,
                    footer: {
                        text: client.getFooter(),
                        icon_url: client.user.avatarURL
                    }
                });
            }
        }
    ]
});