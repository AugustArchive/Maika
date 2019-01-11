'use strict';

const i18n = require('i18n');
const path = require('path');

module.exports = {
    // Before submitting an locale, please add the locale here
    bootstrap: () => i18n.configure({
        locales: ['en_US'],
        defaultLocale: 'en_US',
        directory: path.join(__dirname, '..', '..', 'locales'),
        autoReload: false,
        objectNotation: true
    }),
    i18n: () => i18n
}