const Command = require('../../core/command');
const { stripIndents } = require('common-tags');
const child = require('child_process');
const { DESCRIPTION } = require('../../util/embed-titles');

module.exports = new Command({
    command: 'exec',
    description: 'Evaluate arbitrary Shell code within Maika (#owo)',
    category: { name: 'Developers', emoji: ':hammer:' },
    aliases: ['sh', 'bash'],
    checks: { owner: true, hidden: true },
    run: (client, msg) => {
        if (!msg.args[0])
            return msg.reply(`**${msg.sender.username}**: I would like it if you gave a script to execute. c:`);
        
        const started = Date.now();
        const script = msg.args.join(' ');

        child.exec(script, (error, stdout, stderr) => {
            if (!stdout && !stderr)
                return msg.reply(`**${msg.sender.username}**: Evaluated without an output. :c`);

            if (stdout)
                return msg.embed({
                    title: 'Execution was a success!',
                    color: 0x00FF00,
                    description: stripIndents`
                        ${DESCRIPTION} Errored: **No**
                        ${DESCRIPTION} Ended At: **${Date.now() - started}ms**
                        \`\`\`
                        ${stdout}
                        \`\`\`
                    `
                });

            if (error)
                return msg.embed({
                    title: 'Executed Errored',
                    color: 0xFF0000,
                    description: stripIndents`
                        ${DESCRIPTION} Errored: **Yes**
                        ${DESCRIPTION} Ended At: **${Date.now() - started}ms**
                        \`\`\`
                        ${stdout}
                        \`\`\`
                    `
                });
        });
    }
});