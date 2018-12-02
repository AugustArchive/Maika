const Plugin           = require('../structures/plugin');
const fetch            = require('node-fetch');
const util             = require('util');
const { stripIndents } = require('common-tags');
const { exec }         = require('child_process');

module.exports = new Plugin({
    name: 'Developers',
    visible: false,
    embeded: '🛠 Developer Tools',
    enabled: true,
    commands: [{
        command: 'eval',
        description: 'Evaluates arbitrary JavaScript scripts within the bot.',
        usage: '<script>',
        aliases: ['evl', 'ev', 'js', 'script'],
        async run(bot, msg) {
            if (!msg.args[0])
                return msg.reply(`**${msg.sender.username}**: What script do you want me to evaluate?`);

            const start = Date.now();
            const input = msg.args.join(' ');
            const asynchr = (input.includes('return') || input.includes('await'));
            const slient = (input.includes('--slient') || input.includes('-s'));

            if (slient)
                input = input.replace(/--slient|-s/i, '');

            let result;
            let error;

            try {
                result = await (asynchr ? eval(`(async()=>{${input}})();`) : eval(input));
                if (typeof result !== 'string') {
                    result = util.inspect(result, {
                        depth: +!(util.inspect(result, { depth: 1 }).length > 1990), // Results in either 0 or 1
                        showHidden: true
                    });
                }
                result = bot.constants.redact(bot, result);
            } catch(ex) {
                error = true;
                result = ex.message;
            }

            if (!slient)
                return msg.embed({
                    title: error ? 'Evaluation Errored' : 'Evaluation Success',
                    color: bot.constants.error(error),
                    description: stripIndents`
                        **${Date.now() - start}ms**
                        \`\`\`js
                        ${result}
                        \`\`\`
                    `
                });
        }
    },
    {
        command: 'exec',
        description: 'Executes arbitrary shell code within the bot\'s terminal.',
        usage: '<script>',
        aliases: ['shell'],
        async run(bot, msg) {
            if (!msg.args[0])
                return msg.reply(`**${msg.sender.username}**: I need a script to execute.`);

            const startedAt = Date.now();
            const script = msg.args.join(" ");

            exec(script, (error, stdout, stderr) => { 
                if (!stdout && !stderr)
                    return msg.reply(`**${msg.sender.username}**: No output received.`);
                
                if (stdout)
                    return msg.code('fix', `${Date.now() - startedAt}ms\n${stdout}`);
                if (error)
                    return msg.code('fix', `${Date.now() - startedAt}ms\n${stderr}`);
            });
        }
    },
    {
        command: 'request',
        description: "Requests the body of an URL.",
        usage: '<url>',
        aliases: ['req'],
        async run(bot, msg) {
            if (!msg.args[0])
                return msg.reply(`**${msg.sender.username}**: No \`<url>\` argument passed.`);

            const startedAt = Date.now();
            const mes = await msg.reply(`**${msg.sender.username}**: Requesting to \`${msg.args[0]}\`...`);
            const req = await fetch(msg.args[0], { method: 'GET', headers: { 'User-Agent': bot.constants.USER_AGENT } });
            if (req.ok) {
                const result = await req.json();
                await mes.delete();
                return msg.code('js', `// ${Date.now() - startedAt}ms\n${util.inspect(result).slice(0, 1300)}`);
            } else
                return msg.reply(`**${msg.sender.username}**: Request wasn't successful, is the website online?`);
        }
    }]
});