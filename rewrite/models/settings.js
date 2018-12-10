const { STRING, JSONB } = require('sequelize');
const { database }      = require('../core/database');

const Settings = database.define('settings', {
    guildID: {
        type: STRING,
        allowNull: false,
        primaryKey: true
    },
    settings: {
        'type': JSONB,
        'allowNull': false,
        'default': {}
    }
});

module.exports = Settings;