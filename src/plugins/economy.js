const Plugin = require('../structures/plugin');

module.exports = new Plugin({
    name: 'Economy',
    embeded: '💴 Economy',
    visible: true,
    commands: [{
        command: 'balance',
        description: 'Shows yours or another user\'s avatar.',
        usage: '[user]',
        aliases: ['bal', 'yen'],
        category: 'Economy',
        run(msg) {
            
        }
    }]
});