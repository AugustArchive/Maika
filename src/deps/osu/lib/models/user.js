module.exports = class UserModel {
    constructor(data) {
        this.id = data.user_id;
        this.username = data.username;
        this.joinedAt = data.join_date;
        this.counts = {
            300: data.count300,
            100: data.count100,
            50: data.count50
        };
        this.playcount = parseInt(data.playcount).toLocaleString();
        this.scores = {
            ranked: parseInt(data.ranked_score).toLocaleString(),
            total: parseInt(data.total_score).toLocaleString()
        };
        this.pp = parseInt(data.pp_raw).toFixed();
        this.rank = parseInt(data.pp_rank).toLocaleString();
        this.level = parseInt(data.level).toFixed();
        this.accuracy = parseInt(data.accuracy).toFixed(2);
        this.count_ranks = {
            SSH: data.count_rank_ssh,
            SS: data.count_rank_ss,
            SH: data.count_rank_sh,
            S: data.count_rank_s,
            A: data.count_rank_a
        };
        this.country = data.country;
        this.countryRank = data.pp_country_rank;
    }
};