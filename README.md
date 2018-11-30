# Maika
> Customizable, stable Discord bot made in the [Eris](https://abal.moe/Eris) library.

## Credits
* dragonfire535 - **Search Commands**
* PassTheMayo   - **Plugin system but modified to use classes.**
* other devs    - **Other developers who made npm modules (some aren't August's but some are.) (src/deps)**

## Plugin Example
```js
const Plugin = require('../structures/plugin');

module.exports = new Plugin({
    name: 'test', // The plugin name
    embeded: ':gear: Test', // The plugin embeded title
    visible: true, // If the plugin should be visible to all users
    enabled: true, // If the plugin should be registered in the PluginRegistry
    commands: [ // The command array
        {
            command: 'test', // The command name (REQUIRED)
            description: 'owo?', // The command description (REQUIRED)
            usage: '', // The command usage (optional but put it if there is any arguments)
            aliases: ['debug'], // The command aliases
            hidden: true, // If the command should be hidden from the help command
            owner: true, // If the command should be ran by the owners
            guild: false, // If the command should be ran in Discord guilds
            run: (msg) => msg.reply('hi!') // The run function
        }
    ]
});
```
