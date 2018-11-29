const { STRING, BOOLEAN } = require('sequelize');

/** @param {import('sequelize').Sequelize} db The database */
module.exports = (db) => db.define('feeds', {
    guildID: {
        type: STRING,
        allowNull: false,
        primaryKey: true
    },
    enabled: {
        type: BOOLEAN,
        allowNull: false
    },
    channelID: {
        type: STRING,
        allowNull: true
    }
});