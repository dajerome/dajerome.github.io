class JeopardyLib {

  constructor () {}

// ========================================

  init = (data) => {
    this.scores = data.scores;

    this.setWeeklyScores();
    this.setSeasonStats();
  }

// ========================================

  setWeeklyScores = () => {
    this.weeklyScores = [];
    for (let week in this.scores) {
      this.weeklyScores.push(this.sortScores(this.scores[week], "desc"));
    }
  }

// ========================================

  getWeeklyScores = () => {
    return this.weeklyScores;
  }

// ========================================

  setSeasonStats = () => {
    let highestWeeklyScoreEver = null;
    let summedWeeklyScores = {};
    let averageWeeklyScores = {};

    for (let i in this.weeklyScores) {
      let week = this.weeklyScores[i];
      let weekNumber = i == 0 ? this.weeklyScores.length : i;
  
      for (let player in week) {
        // Set highest weekly score ever
        if (!highestWeeklyScoreEver) {
          highestWeeklyScoreEver = {
            player: player,
            score: week[player].post,
            week: this.weeklyScores.length - parseInt(i)
          };
        }
        else {
          if (week[player].post > highestWeeklyScoreEver.score) {
            highestWeeklyScoreEver = {
              player: player,
              score: week[player].post,
              week: this.weeklyScores.length - parseInt(i)
            };
          }
        }

        // Sum weekly scores
        if (!(player in summedWeeklyScores)) {
            summedWeeklyScores[player] = {pre: 0.0, post: 0.0};
        }
        summedWeeklyScores[player].pre += week[player].pre;
        summedWeeklyScores[player].post += week[player].post != -1 ? week[player].post : 0;
      }
    }

    for (let player in summedWeeklyScores) {
      averageWeeklyScores[player] = {
        pre: summedWeeklyScores[player].pre/(this.weeklyScores.length),
        post: summedWeeklyScores[player].post/(this.weeklyScores.length)
      };
    }

    this.seasonStandings = lib.sortScores(summedWeeklyScores, "desc");
    this.seasonStats = {
      highestWeeklyScoreEver,
      averageWeeklyScores: this.sortScores(averageWeeklyScores, "desc")
    };
  }

// ========================================

  getSeasonStandings = () => {
    return this.seasonStandings;
  }

// ========================================

  getSeasonStats = () => {
    return this.seasonStats;
  }

// ========================================

  sortScores = (scores, dir) => {
    const scoresSorted = []
    for (let player in scores) {
      scoresSorted.push([player, scores[player]]);
    }
    scoresSorted.sort((a, b) => a[1].post != b[1].post ? (
      dir == "asc" ? a[1].post - b[1].post : b[1].post - a[1].post
    ) : a[1].pre != b[1].pre ? (
      dir == "asc" ? a[1].pre - b[1].pre : b[1].pre - a[1].pre
    ) : a[0].localeCompare(b[0]));

    const result = {};
    scoresSorted.forEach((item) => result[item[0]] = item[1]);
    return result;
  }

// ========================================

  toCurrency = (val) => {
    if (val == -1) {
      return "DNQ";
    }

    const numberVal = parseFloat(val);
    if (isNaN(numberVal)) {
      return "ERR";
    }

    const formatter = new Intl.NumberFormat('en-US', {
      // 'en-US' locale uses commas for thousands separators
      minimumFractionDigits: 0, // Ensure no decimals
      maximumFractionDigits: 0, // Ensure no decimals
    });

    return formatter.format(numberVal)
  }

// ========================================

  getData = async (url) => {
    const response = await fetch(url);
    return await response.json();
  }
}
