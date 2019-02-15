const { stripIndents } = require('common-tags');
const { Command }      = require('@maika.xyz/kotori');
const axios            = require('axios').default;
const util             = require('util');

/**
 * Truncates api keys into `--snip--`
 * @param {import('@maika.xyz/kotori').Client} client The client instance
 * @param {string} result The result
 * @returns {string} The truncated string
 */
function redact(client, result) {
    const keys = new RegExp([
        client.token,
        process.env.LAVALINK_HOST,
        process.env.LAVALINK_PASSWORD,
        process.env.DB_URL,
        process.env.PPY,
        process.env.WOLKE,
        process.env.MAIKA_TOKEN
    ].join('|'), 'gi');
    return result.replace(keys, '--snip--');
}

module.exports = class EvalCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'eval',
            description: 'Evaluate JavaScript code.',
            usage: '<script>',
            aliases: [
                'js',
                'evl',
                'script'
            ],
            ownerOnly: true,
            hidden: true
        });
    }

    /**
     * Run the `eval` command
     * @param {import('@maika.xyz/kotori').CommandContext} ctx The command context
     */
    async run(ctx) {
        if (ctx.args.isEmpty(0)) {
            const usage = this.getFormat();
            const string = await ctx.translate('INVALID_USAGE', usage);
            return ctx.send(string);
        }

        let script = ctx.args.gather();
        const isAsync = (script.includes('return') || script.includes('await'));
        let isSlient = (script.includes('--slient') || script.includes('-s') || script.includes('-slient'));
        const started = Date.now();
        
        if (isSlient) script = script.replace(/--slient|-s|-slient/i, '');

        try {
            let result = await eval(isAsync? `(async() => {${script}})()`: script);
            if (typeof result !== 'string') result = util.inspect(result, { 
                depth: +!(util.inspect(result, { depth: 1 })), 
                showHidden: true 
            });

            console.log(result);
            result = redact(this.client, result);

            if (result.length > 1990) {
                const url = await this.post(result);
                const str = await ctx.translate('COMMAND_EVAL_TOO_LONG', url);
                return ctx.send(str);
            } else {
                const translated = await ctx.translate('COMMAND_EVAL_SUCCESS', Date.now() - started);
                const colour = this.getEvalColor(false);
                return ctx.embed({
                    title: '[ Evaluation Success ]',
                    color: colour,
                    description: stripIndents`
                        **${translated}**
                        \`\`\`js
                        ${result}
                        \`\`\`
                    `
                });
            }
        } catch(ex) {
            const color = this.getEvalColor(true);
            return ctx.embed({
                title: '[ Evaluation Errored ]',
                color,
                description: stripIndents`
                    **${await ctx.translate('COMMAND_EVAL_FAILED', Date.now() - started)}**
                    \`\`\`js
                    ${ex.message}
                    \`\`\`
                `
            });
        }
    }

    /**
     * Determines evaluation errors
     * @param {boolean} error If it errored
     */
    getEvalColor(error) {
        const bool = error? true: false;
        return {
            true: 0xFF0000,
            false: 0x00FF00
        }[bool];
    }

    /**
     * Posts raw data to Hastebin
     * @param {any} dataT Data to post
     * @returns {Promise<string>} The URL
     */
    post(dataT) {
        return new Promise(async(resolve, reject) => {
            const { data } = await axios.post('https://hastebin.com/documents', {
                headers: { 'User-Agent': `Maika/DiscordBot (v${require('../../../package').version})` },
                data: dataT
            });

            if (!data) reject();
            resolve(`https://hastebin.com/${data.key}.js`);
        });
    }
}