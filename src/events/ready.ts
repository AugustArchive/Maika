import { Client, Event } from '@maika.xyz/kotori';
import { MessageEmbed } from '@maika.xyz/eris-utils';

export class ReadyEvent extends Event {
    constructor(client: Client) {
        super(client, { event: 'ready', emitter: "client" });
    }

    async run() {
        console.info(`[${this.client.user.username}#${this.client.user.discriminator}] <=> Connected to Discord.`);
        this.client.editStatus('online', {
            name: `${(process.env.MAIKA_PREFIX) as string}help [${this.client.guilds.size}]`,
            type: 0
        });
        this.client.createMessage((process.env.LOG_CHANNEL) as string, {
            embed: new MessageEmbed()
                .setColor('random')
                .setDescription('Connected to Discord.')
                .build()
        });
    }
}