const { Guild } = require('eris');
const Provider  = require('../provider');
const Settings  = require('../../models/settings');

module.exports = class SettingsProvider extends Provider {
    constructor() {
        super(Settings, {
            id: 'guildID',
            data: 'settings'
        });
    }

    /**
     * Gets a value
     * 
     * @param {string} id The ID
     * @param {string} key The key
     * @param {any} [val] The value
     */
    get(id, key, val) {
        const guild = SettingsProvider.getId(id);
        return super.get(guild, key, val);
    }

    set(id, key, val) {
        const guild = SettingsProvider.getId(id);
        return super.set(guild, key, val);
    }

    delete(id, key) {
        const guild = SettingsProvider.getId(id);
        return super.delete(guild, key);
    }

    clear(id) {
        const guild = SettingsProvider.getId(id);
        return super.clear(guild);
    }

    static getId(guild) {
        if (guild instanceof Guild) return guild.id;
        if (guild === 'global' || guild === null) return 'global';
        if (typeof guild === 'string' && /^\d+$/.test(guild)) return guild;
        throw new TypeError('Invalid guild specified. Must be a Guild instance, a guild ID, "global", or null.');
    }
};

