import { Scheduler, Client } from '@maika.xyz/kotori';
import axios from 'axios';

export class BotListScheduler extends Scheduler {
    constructor(client: Client) {
        super(client, { name: 'botlists', interval: 900000 });
    }

    async run() {
        // Lets not make Mafuyu post to bot lists.
        if (this.client.user.id === '508842721545289731')
            return;

        // discord.boats
        await axios.post(`https://discord.boats/api/bots/${this.client.user.id}`, {
            data: { server_count: this.client.guilds.size },
            headers: {
                'User-Agent': "Maika/DiscordBot (https://github.com/MaikaBot/Maika)",
                Authorization: (process.env.UNTO) as string
            }
        }).then(() => console.log(`Posted ${this.client.guilds.size} guilds to discord.boats!`));

        // discordbotindex.com
        await axios.post(`https://discordbotindex.com/apiv1/bots/${this.client.user.id}`, {
            data: { server_count: this.client.guilds.size },
            headers: {
                'User-Agent': "Maika/DiscordBot (https://github.com/MaikaBot/Maika)",
                Authorization: (process.env.DERPY) as string
            }
        }).then(() => console.log(`Posted ${this.client.guilds.size} guilds to discordbotindex.com`));

        // discordbots.org
        await axios.post(`https://discordbots.org/api/bots/${this.client.user.id}/stats`, {
            data: { server_count: this.client.guilds.size },
            headers: {
                'User-Agent': "Maika/DiscordBot (https://github.com/MaikaBot/Maika)",
                Authorization: (process.env.OLIY) as string
            }
        }).then(() => console.log(`Posted ${this.client.guilds.size} guilds to discordbots.org`));
    }
};