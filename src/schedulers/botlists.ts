import { Scheduler, Client } from '@maika.xyz/kotori';
import axios from 'axios';

export default class BotListScheduler extends Scheduler
{
    constructor(client: Client) {
        super(client, { name: 'botlists', interval: 60 * 1000 });
    }

    async run() {
        // If it's running Mafuyu (test bot)
        if (this.client.user.id === '') return;

        // discordbots.org
        await axios({
            url: `https://discordbots.org/api/bots/${this.client.user.id}/stats`,
            method: 'POST',
            headers: {
                'User-Agent': `Maika/DiscordBot (https://github.com/MaikaBot/Maika v${require('../../package').version})`,
                Authorization: (process.env.OLIY) as string
            },
            data: {
                server_count: this.client.guilds.size,
                shard_count: this.client.ws.shards.size
            }
        }).then(data => this.client.logger.info(`  Posted to discordbots.org!\nSent: ${this.client.guilds.size} guilds & ${this.client.ws.shards.size} shards.\nPayload: ${data}`))
          .catch(error => this.client.logger.warn(`  Unable to post to discordbots.org:\n${error}`));
    }
}