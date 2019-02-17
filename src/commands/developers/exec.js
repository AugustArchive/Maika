const { Command } = require('@maika.xyz/kotori');
const child       = require('child_process');

module.exports = class ExecCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'exec',
            description: 'Evaluate shell code within the bot\'s terminal',
            usage: '<script>',
            aliases: [
                'sh'
            ],
            ownerOnly: true,
            hidden: true,
            category: 'Developers'
        });
    }

    async run(ctx) {
        if (ctx.args.isEmpty(0)) {
            const usage = await this.getFormat(ctx);
            const trans = await ctx.translate('INVALID_USAGE', usage);
            return ctx.send(trans);
        }

        const script = ctx.args.gather(' ');
        child.exec(script, async (error, stdout, stderr) => {
            if (error) {
                const translatedIGuess = await ctx.translate('COMMAND_EXEC_ERROR', stderr);
                return ctx.send(translatedIGuess);
            }

            if (stdout) {
                const sweet = await ctx.translate('COMMAND_EXEC_SUCCESS', stdout);
                return ctx.send(sweet);
            }

            if (!stdout && !stderr) {
                const yeetus = await ctx.translate('COMMAND_EXEC_NO_RESULT');
                return ctx.send(yeetus);
            }
        });
    }
}