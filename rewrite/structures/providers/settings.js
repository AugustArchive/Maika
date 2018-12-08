const { Guild } = require('eris');
const Provider  = require('../provider');
const Settings  = require('../../schema/settings');

module.exports = class SettingsProvider extends Provider {
    constructor() {
        super(Settings);
    }

    get(id, key, val) {
        const guild = this.constructor.getId(id);
        return super.get(guild, key, val);
    }

    set(id, key, val) {
        const guild = this.constructor.getId(id);
        return super.set(guild, key, val);
    }

    delete(id, key) {
        const guild = this.constructor.getId(id);
        return super.delete(guild, key);
    }

    clear(id) {
        const guild = this.constructor.getId(id);
        return super.clear(guild);
    }

    static getId(guild) {
        if (guild instanceof Guild) return guild.id;
        if (guild === 'global' || guild === null) return 'global';
        if (typeof guild === 'string' && /^\d+$/.test(guild)) return guild;
        throw new TypeError('Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.');
    }
};

