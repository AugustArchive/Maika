const { Constants } = require('eris');

module.exports = class PermissionUtil {
    /**
     * Gathers the permission by bitcoding it
     * @param {number|string|number[]} permission The bitfield permission area
     * @returns {number} The permission bitcoded
     */
    static gather(permission) {
        if (typeof permission === 'number' && permission >= 0)
            return permission;

        if (permission instanceof Array)
            return permission.map(p => this.gather(p)).reduce((previous, p) => previous | p, 0);

        if (typeof permission === 'string')
            return Constants.Permissions[permission];

        throw new RangeError('Invalid permission bitfield.');
    }

    /**
     * If a user has permission to do anything
     * @param {import('eris').Member} member The member
     * @param {import('../core/internal/plugin').Permission} permission The humanized permission node
     * @returns {boolean} If the user has it or not
     */
    static has(member, permission) {
        if (member.permission.has(permission))
            return true;
        else
            return false;
    }
}