const { Command }  = require('@maika.xyz/kotori');
const { humanize } = require('@maika.xyz/miu');
const TableCI      = require('table');
const os           = require('os');

module.exports = class StatisticsCommand extends Command {
    constructor(client) {
        super(client, {
            command: 'statistics',
            description: (client) => `View ${client.user.username}'s realtime statistics`,
            aliases: ['stats', 'botinfo', 'bot', 'info']
        });

        /**
         * Table config
         * @type {TableCI.TableUserConfig}
         * @credit https://github.com/PassTheWessel/wump/blob/master/src/commands/Discord/Information/stats.js#L31
         */
        this.config = {
            border: {
                topBody: '─',
                topJoin: '┬',
                topLeft: '┌',
                topRight: '┐',
            
                bottomBody: '─',
                bottomJoin: '┴',
                bottomLeft: '└',
                bottomRight: '┘',
            
                bodyLeft: '│',
                bodyRight: '│',
                bodyJoin: '│',
            
                joinBody: '─',
                joinLeft: '├',
                joinRight: '┤',
                joinJoin: '┼'
            },
            drawHorizontalLine: (i, s) => i === 0 || i === 1 || i === s
        };
    }

    /**
     * Run the 'stats' command
     * @param {import('@maika.xyz/kotori').CommandContext} context The command context
     */
    async run(context) {
        const data = [
            ['Key', 'Value'],
            ['Guilds', this.client.guilds.size.toLocaleString()],
            ['Users', this.client.users.size.toLocaleString()],
            ['Channels', Object.keys(this.client.channelGuildMap).length.toLocaleString()],
            ['Uptime', humanize(Date.now() - this.client.startTime)],
            ['Operating System', `${this.parsePlatform(process.platform)} ${os.arch()? os.arch(): 'x32'} (${os.release()? os.release(): '?.?.?'})`],
            ['OS Uptime', humanize(os.uptime() * 1000)],
            ['Memory Usage', `${this.parseMemory(process.memoryUsage().heapUsed)}/${this.parseMemory(os.totalmem())} (${((process.memoryUsage().heapUsed / os.totalmem()) * 100).toFixed(2)}%)`]
        ];
        const table = TableCI.table(data, this.config);

        return context.send(`\`\`\`\n${table}\`\`\``);
    }

    /**
     * Parses the platform
     * @param {NodeJS.Platform} p The platform
     * @returns {string} The parsed platform
     * @credit https://github.com/PassTheWessel/wump/blob/master/src/commands/Discord/Information/stats.js#L78
     */
    parsePlatform(p) {
        switch (p) {
            case 'aix': return 'Linux';
            case 'sunos': return 'Linux';
            case 'win32': return 'Windows';
            case 'linux': return 'Linux';
            case 'darwin': return 'Macintosh (MacOS)';
            case 'freebsd': return 'Linux';
            case 'openbsd': return 'Linux';
            case 'android': return 'Mobile';
            default: return 'Unknown';
        }
    }

    /**
     * Parse any given HDD/SSD memory measurement
     * @param {number} bytes The bytes to conver
     * @returns {string} The bytes converted
     */
    parseMemory(bytes) {
        const KB = bytes / 1024;
        const MB = KB / 1024;
        const GB = MB / 1024;
        if (KB < 1024) return `${KB.toFixed().toLocaleString()}KB`;
        if (KB > 1024 && MB < 1024) return `${MB.toFixed().toLocaleString()}MB`;
        return `${GB.toFixed().toLocaleString()}`;
    }
}