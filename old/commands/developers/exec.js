const { Command } = require('../../core');
const codeblock = require('../../util/codeblock');
const child = require('child_process');

module.exports = class ExecCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'exec',
            description: 'Executed bash code within the terminal.',
            usage: '<script>',
            aliases: ['bash', 'shell', '$'],
            owner: true,
        });
    }

    /**
     * Runs the `exec` command
     * @param {import('../../core/internal/context')} ctx The command context
     */
    async run(ctx) {
        if (!ctx.args[0])
            return ctx.send(`${client.emojis.ERROR} **|** Provide a script.`);

        const message = await ctx.raw(`${client.emojis.GEARS} **|** Now evaluating script...`, {
            description: codeblock('sh', `$ ${ctx.args.join(' ')}`),
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
};