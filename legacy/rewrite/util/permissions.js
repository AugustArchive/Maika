module.exports = class Permissions {
    /**
     * Fetches all of the permissions from the current member
     * 
     * @param {import('eris').Member} member The member
     * @param {string} permission The permission
     * @returns {boolean}
     */
    static fetch(member, permission) {
        if (member.permission.has(permission))
            return true;
        else
            return false;
    }
};