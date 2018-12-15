module.exports = class RandomImageModel {
    constructor(data) {
        this.id = data.id;
        this.type = data.type;
        this.nsfw = data.nsfw;
        this.hidden = data.hidden;
        this.url = data.url;
        this.tags = data.tags > 0 ? data.tags.join(', ') : 'None';
    }
};