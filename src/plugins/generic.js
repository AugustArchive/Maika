const { stripIndents } = require('common-tags');
const { elipisis: shorten, uppercase: toUpper } = require('../util/string');
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
                Grabs the last 10 commits from ${client.user.username}'s repository!
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
        },
        {
            command: 'donate',
            description: (client) => `Gives the donation link for ${client.user.username}. (Warning: Patreon page will be redone.)`,
            aliases: ['donations', 'patreon'],
            run: (client, ctx) => ctx.raw(`${client.emojis.GEARS} **|** It's completely optional to donate! **<https://patreon.com/ohlookitsAugust>**`, {
                description: `:warning: **If you decline the purchase, you will get your donator status removed AND you will be blacklisted from ${client.user.username} IF it's a good reason why you declined.**`,
                color: client.color,
                footer: { text: client.getFooter() }
            })
        },
        {
            command: 'help',
            description: (client) => stripIndents`
                Shows documentation on ${client.user.username}'s plugins or gets help on a command/plugin.
            `,
            usage: '[plugin|:command]',
            aliases: ['halp', 'h', '?', 'plugin', 'plugins'],
            run: async (client, ctx) => {
                let categories = [];
                let guild = await ctx.getGuildSettings(ctx.guild.id);

                if (!ctx.args[0]) {
                    client
                        .manager
                        .plugins
                        .filter(pl => client.owners.includes(ctx.sender.id) ? true: !pl.visible)
                        .forEach((pl) => {
                            if (!categories.includes(pl))
                                categories.push(pl);
                        });

                    return ctx.embed({
                        title: `${client.user.username}#${client.user.discriminator} | Plugins List`,
                        description: stripIndents`
                            **To use a command, do \`${guild['prefix']}<command>\`.**
                            **To get help on a plugin, do \`${guild['prefix']}help <pluginName>\` to view it's commands.**
                            **To get help on a command, do \`${guild['prefix']}help --command <pluginName:commandName>\`**

                            ${categories.map(s => `\`${s.name}\`: **${s.description}** (${s.commands.size} Commands)`).join('\n')}
                        `,
                        color: client.color,
                        footer: { text: `${client.manager.plugins.size} Plugins | ${client.getFooter()}` }
                    });
                }

                if (ctx.args[0].toLowerCase() === '--command') {
                    if (!ctx.args[1])
                        return ctx.send(`${client.emojis.ERROR} **|** You must provide an argument for command searches.\nExample: \`${guild['prefix']}help --command generic:donate\``);

                    const args = ctx.args[1].split(':');
                    const plugin = client.manager.plugins.filter(
                        (pl) => pl.name === args[0]
                    );
                    const isPlugin = (plugin.length > 0 ? true : false);

                    if (isPlugin) {
                        const command = plugin[0].hasCommand(args[1]);
                        if (command) {
                            const c = plugin[0].getCommand(args[1]);
                            return ctx.embed({
                                title: `Command ${c.command}`,
                                description: typeof c.description === 'function' ? c.description(client) : c.description,
                                fields: [
                                    {
                                        name: 'Usage', value: `${guild['prefix']}${c.command}${c.usage ? ` ${c.usage}` : ''}`, inline: true
                                    },
                                    {
                                        name: 'Plugin', value: toUpper(args[1]), inline: true
                                    },
                                    {
                                        name: 'Aliases', value: (() => {
                                            return c.aliases && c.aliases.length > 1 ? 'No aliases.': aliases.join(', ')
                                        })(), inline: true
                                    },
                                    //{
                                       //name: 'Permissions Required', value: (() => {
                                            //return c.permissions && c.permissions.length > 0 ? 'No permissions.' : permissions.map(s => `\`${s}\``).join('`, `')
                                        //})(), inline: true
                                    //},
                                    {
                                        name: 'Guild Only', value: c.guild ? 'Yes' : 'No', inline: true
                                    },
                                    {
                                        name: 'Owner Only', value: c.owner ? 'Yes' : 'No', inline: true
                                    }
                                ],
                                color: client.color,
                                footer: { text: client.getFooter() }
                            });
                        } else
                            return ctx.send(`${client.emojis.ERROR} **|** Unknown command: \`${args[1]}\`.`);
                    } else
                        return ctx.send(`${client.emojis.ERROR} **|** Unknown plugin: \`${args[0]}\`.`);
                } else {
                    const arg = ctx.args[0];
                    const plugin = client.manager.plugins.filter(
                        (pl) => pl.name === arg.toLowerCase()
                    );

                    if (plugin.length > 0) {
                        const pl = plugin[0];
                        return ctx.embed({
                            title: `Plugin ${toUpper(pl.name)}`,
                            description: stripIndents`
                                **${pl.description}**
                                ${pl.commands.map(s => `\`${guild['prefix']}${s.command}${s.usage ? ` ${s.usage}` : ''}\`: **${(typeof s.description === 'function' ? s.description(client) : s.description)}**`).join('\n')}
                            `,
                            color: client.color,
                            footer: { text: `${pl.commands.size} commands in the ${toUpper(pl.name)} plugin | ${client.getFooter()}` }
                        });
                    } else
                        return ctx.send(`${client.emojis.ERROR} **|** Unknown plugin: \`${arg}\`.`);
                }
            }
        }
    ]
});