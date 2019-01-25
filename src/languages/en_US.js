const { Language } = require('../core');

module.exports = new Language({
    name: 'English (United States)',
    code: 'en_US',
    flag: ':flag_us:',
    translator: 'August#5820',
    completion: 100,
    map: [
        {
            "errors": {
                "cooldown": "{{error}} **|** {{user}}, you have {{time}} second{{left}} to execute the `{{command}}` command.",
                "api": "{{error}} **|** An error occured! `{{errorMessage}}`. Try again later!",
                "command": {
                    "title": "{{author}}, an command has errored!",
                    "description": "Command {{command}} has errored: {{message}}.\nContact {{or}} at ***<https://discord.gg/7TtMP2n>***"
                },
                "guild": "{{error}} **|** You cannot use the `{{command}}` without being in a guild.",
                "owner": "{{error}} **|** You cannot use the `{{command}}` without being a developer."
            },
            "commands": {
                "crytocurrency": {
                    "bitcoin": {
                        "missing": "{{error}} **|** Missing `us` or `eu` locale.",
                        "embed": {
                            "last": ":black_small_square: **Last**: {{last}}",
                            "highest": ":black_small_square: **Highest**: {{highest}}"
                        }
                    }
                },
                "discord": {},
                "economy": {},
                "generic": {},
                "moderation": {},
                "music": {},
                "settings": {},
                "utility": {}
            }
        }
    ]
});