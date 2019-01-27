const { Plugin } = require('../core');
const axios = require('axios');
const child = require('child_process');
const util = require('util');
const { readdir } = require('fs');

module.exports = new Plugin({
    name: 'developers',
    description: 'Easy to use developer commands for the developers.',
    visible: false,
    commands: [
        {
            command: 'eval',
            description: 'Run javascript code within the bot.',
            usage: '<script>',
            aliases: ['evl', 'ev', 'js'],
            owner: true,
            run: async(client, ctx) => {
                if (!ctx.args[0])
                    return ctx.send(`${client.emojis.ERROR} **|** Provide a script to evaluate.`);

                const startedAt = Date.now();
                let script = ctx.args.join(' ');
                const isAsync = (script.includes('return') || script.includes('await'));
                const isSlient = (script.includes('--slient') || script.includes('-s'));

                if (isSlient)
                    script = script.replace(/--slient|-s/i, '');

                try {
                    let result = await eval(isAsync? `(async() => {${script}})()`: script);
                    if (typeof result !== 'string')
                        result = util.inspect(result, {
                            depth: +!(util.inspect(result, { depth: 1 })),
                            showHidden: true
                        });
                    result = client.redact(result);

                    if (result.length > 1990) {
                        const resp = await axios.post('https://hastebin.com/documents', {
                            headers: { 'User-Agent': 'Maika/DiscordBot' },
                            data: result
                        });
                        ctx.send(`${client.emojis.INFO} **|** Evaluation is way too long for Discord.\n**<https://hastebin.com/${resp.data.key}.js>`);
                    } else {
                        if (!isSlient)
                            ctx.raw(`***Took ${Date.now() - startedAt}ms to execute.***`, {
                                description: `\`\`\`js\n${result}\`\`\``,
                                color: 0x00FF00,
                                footer: { text: `Evaluation succeeded | ${client.getFooter()}` }
                            });
                    }
                } catch(ex) {
                    if (!isSlient)
                        ctx.raw(`***Took ${Date.now() - startedAt}ms to execute.***`, {
                            description: `\`\`\`js\n${ex.message}\`\`\``,
                            color: 0xFF0000,
                            footer: { text: `Evaluation failed | ${client.getFooter()}` }
                        });
                }
            }
        },
        {
            command: 'exec',
            description: 'Executed bash code within the terminal.',
            usage: '<script>',
            aliases: ['bash', 'shell', '$'],
            owner: true,
            run: async(client, ctx) => {
                if (!ctx.args[0])
                    return ctx.send(`${client.emojis.ERROR} **|** Provide a script.`);

                const message = await ctx.raw(`${client.emojis.GEARS} **|** Now evaluating script...`, {
                    description: ctx.args.join(' '),
                    color: client.color,
                    footer: { text: `Evaluating script... | ${client.getFooter()}` }
                });

                child.exec(ctx.args.join(' '), async(error, stdout, stderr) => {
                    await message.delete();

                    if (!stdout && !stderr)
                        return ctx.send(`${client.emojis.INFO} **|** Script returned no output.`);

                    if (stdout)
                        return ctx.code('sh', stdout);

                    if (error)
                        return ctx.code('sh', stderr);
                });
            }
        },
        {
            command: 'reload',
            description: (client) => `Reloads a plugin from ${client.user.username}'s plugin registry.`,
            usage: '<"all" | plugin>',
            aliases: ['reload-all', 'reload-plugin'],
            owner: true,
            run: async(client, ctx) => {
                if (ctx.args[0]) {
                    const message = await ctx.send(`${client.emojis.GEARS} **|** Reloading plugins...`);
                    if (ctx.args[0] === 'all') {
                        readdir(__dirname, async(error, files) => {
                            if (error) {
                                await message.delete();
                                return ctx.send(`${client.emojis.WARNING} **|** Unable to read the plugins directory.`);
                            }

                            files.forEach((file) => {
                                delete require.cache[require('path').join(__dirname, file)];
                            });

                            await message.delete();
                            ctx.send(`${client.emojis.INFO} **|** Reloaded \`${files.length}\` plugins!`);
                        });
                    } else {
                        const filtered = client.manager.plugins.filter((m) => m.name.toLowerCase() === ctx.args[0].toLowerCase());
                        if (filtered.length < 1) {
                            await message.delete();
                            return ctx.send(`${client.emojis.WARNING} **|** Unable to find the module named: \`${ctx.args[0].toLowerCase()}\`.`);
                        }

                        await message.edit(`${client.emojis.WARNING} **|** Reloading plugin \`${filtered[0].name}\`...`);
                        delete require.cache[require('path').join(__dirname, filtered[0].file)];
                        await message.delete();
                        ctx.send(`${client.emojis.INFO} **|** Reloaded plugin \`${filtered[0].name}\`.`);
                    }
                } else
                    return ctx.send(`${client.emojis.ERROR} **|** Unknown \`<command | "all">\` argument.`);
            }
        }
    ]
});
