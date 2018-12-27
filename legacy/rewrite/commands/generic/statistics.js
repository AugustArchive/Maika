const Command = require('../../core/command');
const { stripIndents } = require('common-tags');
const { DESCRIPTION, TITLE } = require('../../util/embed-titles');
const dependencies = require('../../util/dependencies');

module.exports = new Command({
    command: 'statistics',
    description: (client) => `Grabs ${client.user.username}'s realtime statistics.`,
    aliases: ['stats', 'info', 'bot', 'botinfo'],
    run: (client, msg) => {
        const stats = client.getStatistics();
        const usages = stats.commandUsage();
        return msg.embed({
            title: "[ Realtime Statistics ]",
            description: stripIndents`
                ${TITLE} **General Statistics**:
                ${DESCRIPTION} **Guilds**: ${stats.guilds.toLocaleString()}
                ${DESCRIPTION} **Users**: ${stats.users.toLocaleString()}
                ${DESCRIPTION} **Channels**: ${stats.channels.toLocaleString()}

                ${TITLE} **Command Statistics**:
                ${DESCRIPTION} **Total Commands**: ${stats.commands}
                ${DESCRIPTION} **Messages Seen**: ${stats.messagesSeen.toLocaleString()}
                ${DESCRIPTION} **Commands Executed**: ${stats.commandsExecuted.toLocaleString()}
                ${DESCRIPTION} **Most Used Command**: ${usages.command} [**${usages.uses} times**]

                ${TITLE} **Miscellaneous Statistics**:
                ${DESCRIPTION} **Memory Usage**: ${stats.memory}
                ${DESCRIPTION} **Uptime**: ${stats.uptime}
                ${DESCRIPTION} **Dependencies**: ${dependencies()}
            `,
            color: client.color
        });
    }
});