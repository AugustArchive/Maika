const { string: resolveString, color: resolveColor, clone } = require('../../util/embed');

module.exports = class MessageEmbed {
    constructor(data = {}) {
      this.setup(data);
    }
  
    setup(data) {
      this.type = data.type;
      this.title = data.title;
      this.description = data.description;
      this.color = data.color;
      this.timestamp = data.timestamp ? new Date(data.timestamp).getTime() : null;
      this.fields = data.fields ? data.fields.map(clone) : [];
      this.thumbnail = data.thumbnail ? {
        url: data.thumbnail.url,
        proxyURL: data.thumbnail.proxy_url,
        height: data.thumbnail.height,
        width: data.thumbnail.width,
      } : null;
      this.image = data.image ? {
        url: data.image.url,
        proxyURL: data.image.proxy_url,
        height: data.image.height,
        width: data.image.width,
      } : null;
      this.author = data.author ? {
        name: data.author.name,
        url: data.author.url,
        iconURL: data.author.iconURL || data.author.icon_url,
        proxyIconURL: data.author.proxyIconUrl || data.author.proxy_icon_url,
      } : null;
      this.footer = data.footer ? {
        text: data.footer.text,
        iconURL: data.footer.iconURL || data.footer.icon_url,
        proxyIconURL: data.footer.proxyIconURL || data.footer.proxy_icon_url,
      } : null;
    }
  
    get createdAt() {
      return this.timestamp ? new Date(this.timestamp) : null;
    }
  
    get hex() {
      return this.color ? `#${this.color.toString(16).padStart(6, '0')}` : null;
    }
  
    addField(name, value, inline = false) {
      if (this.fields.length >= 25) throw new RangeError("MessageEmbeds may not exceed 25 fields.");
      name = resolveString(name);
      if (!String(name)) throw new RangeError("MessageEmbed field names may not be empty.");
      value = resolveString(value);
      if (!String(value)) throw new RangeError("MessageEmbed field values may not be empty.");
      this.fields.push({ name, value, inline });
      return this;
    }
  
    addBlankField(inline = false) {
      return this.addField("\u200B", "\u200B", inline);
    }
  
    setAuthor(name, icon, url) {
      this.author = {
        name: resolveString(name),
        iconURL: icon,
        url
      };
      return this;
    }
  
    setColor(color) {
      this.color = resolveColor(color);
      return this;
    }
  
    setDescription(desc) {
      this.description = resolveString(desc);
      return this;
    }
  
    setFooter(txt, icon) {
      this.footer = {
        text: txt,
        iconURL: icon
      };
      return this;
    }
  
    setImage(url) {
      this.image = { url };
      return this;
    }
  
    setThumbnail(url) {
      this.thumbnail = { url };
      return this;
    }
  
    setTimestamp(time = new Date()) {
      this.timestamp = time.getTime();
      return this;
    }
  
    setTitle(t) {
      this.title = resolveString(t);
      return this;
    }
  
    setUrl(url) {
      this.url = url;
      return this;
    }
  
    build() {
      return {
        title: this.title,
        type: 'rich',
        description: this.description,
        url: this.url,
        timestamp: this.timestamp ? new Date(this.timestamp) : null,
        color: this.color,
        fields: this.fields,
        thumbnail: this.thumbnail,
        image: this.image,
        author: this.author ? {
          name: this.author.name,
          url: this.author.url,
          icon_url: this.author.iconURL,
        } : null,
        footer: this.footer ? {
          text: this.footer.text,
          icon_url: this.footer.iconURL,
        } : null,
      };
    }
  };