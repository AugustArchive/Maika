import { Client, Command, CommandMessage } from '@maika.xyz/kotori';

export class TestCommand extends Command {
    constructor(client: Client) {
        super(client, {
            command: 'owo',
            description: 'Test the TypeScript rewrite.'
        });
    }

    async run(msg: CommandMessage) {
        msg.reply('OwO');
    }
};