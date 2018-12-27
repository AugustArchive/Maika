const Command = require('../../core/command');
const fetch = require('node-fetch');
const { elipisis } = require('../../util/string');

module.exports = new Command({
    command: 'changelog',
    aliases: ['git-commits', 'commits'],
    description: "Grabs the last 10 commits from Maika's repository.",
    run: async(client, ctx) => {
        const request = await fetch("https://api.github.com/repos/MaikaBot/Maika/commits");
        const body = await request.json();

        const commits = body.slice(0, 5);
        return ctx.embed({
            title: '[Maika:master] Latest commits',
            color: client.color,
            url: 'https://github.com/MaikaBot/Maika/commits/master',
            description: commits.map(c => `[\`${c.sha.slice(0, 7)}\`](${c.html_url}) ${elipisis(c.commit.message.split('\n')[0], 50)} **-** ${c.author.login}`).join('\n')
        });
    }
});