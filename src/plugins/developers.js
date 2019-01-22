const { Plugin } = require('../core');
const axios = require('axios');
const child = require('child_process');
const util = require('util');

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
        }
    ]
});