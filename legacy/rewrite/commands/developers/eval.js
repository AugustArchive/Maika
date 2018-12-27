const Command = require('../../core/command');
const replace = require('../../util/replace');
const { DESCRIPTION } = require('../../util/embed-titles');
const { stripIndents } = require('common-tags');
const util = require('util');

module.exports = new Command({
    command: 'eval',
    description: 'Evaluate arbitrary JavaScript code to give a result within Maika. (#lewd)',
    aliases: ['ev', 'evl'],
    checks: {
        owner: true,
        hidden: true
    },
    category: {
        name: 'Developers',
        emoji: ':hammer:'
    },
    run: async (client, msg) => {
        if (!msg.args[0])
            return msg.reply(`**${msg.sender.username}**: Sorry but I need a script to evaluate...`);

        const started = Date.now();
        const input = msg.args.join(' ');
        let slient = (input.includes('--slient') || input.includes('-s'));
        const asynchr = (input.includes('return') || input.includes('await'));
        let result;
        let error;

        if (slient)
            slient = input.replace(/--slient|-s/i, '');

        try {
            result = await eval(asynchr ? eval(`(async() => { ${input} })();`) : eval(input));
            if (typeof result !== 'string')
                result = util.inspect(result, {
                    depth: +!(util.inspect(result, { depth: 1 }).length > 1990), // Results in either 0 or 1
                    showHidden: true
                });
            result = replace(client, result);
            error = false;
        } catch (ex) {
            error = true;
            result = ex.message;
        }

        const colours = (!error ? 0x00FF00 : 0xFF0000);
        const titles = (error ? 'Compiliation Errored' : 'Compliliation Success');

        if (!slient)
            return msg.embed({
                title: titles,
                color: colours,
                description: stripIndents`
                    ${DESCRIPTION} Errored: ${!error ? '**No**' : '**Yes**'}
                    ${DESCRIPTION} Ended At: **${Date.now() - started}ms**
                    \`\`\`javascript
                    ${result}
                    \`\`\`
                `
            });
    }
});