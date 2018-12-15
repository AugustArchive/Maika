  /**
   * Parse milliseconds into a humanized duration
   * 
   * @param {number} ms The milliseconds to parse
   * @returns {string} The humanized duration
   */
module.exports = (ms) => {
    const days = Math.floor(ms / 1000 / 60 / 60 / 24);
    ms -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(ms / 1000 / 60 / 60);
    ms -= hours * 1000 * 60 * 60;
    const mins = Math.floor(ms / 1000 / 60);
    ms -= mins * 1000 * 60;
    const sec = Math.floor(ms / 1000);

    let humanized = "";

    if (days > 0) humanized += `${days}d`;
    if (hours > 0) humanized += `${hours}h`;
    if (mins > 0) humanized += `${mins}m`;
    if (sec > 0) humanized += `${sec}s`;

    return humanized;
}