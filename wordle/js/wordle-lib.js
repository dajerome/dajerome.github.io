class WordleLib {

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
      const sums = {};
      for (let player in this.scores[week]) {
        sums[player] = this.scores[week][player].reduce(
          (partialSum, a) => partialSum + a - 4, 0
        );
      }

      this.weeklyScores.push(this.sortScores(sums, "asc"));
    }
  }

// ========================================

  getWeeklyScores = () => {
    return this.weeklyScores;
  }

// ========================================

  setSeasonStats = () => {
    let lowestWeeklyScoreEver = null;
    let highestWeeklyScoreEver = null;
    let averageWeeklyScores = {};
    const wins = {};

    for (let i in this.weeklyScores) {
      if (i == 0) {
        continue;
      }
      let week = this.weeklyScores[i];
  
      let lowScore = 50;
      for (let player in week) {
        // Set lowest weekly score ever
        if (!lowestWeeklyScoreEver) {
          lowestWeeklyScoreEver = {
            player: player,
            score: week[player],
            week: this.weeklyScores.length - parseInt(i)
          };
        }
        else {
          if (week[player] <= lowestWeeklyScoreEver.score) {
            lowestWeeklyScoreEver = {
              player: player,
              score: week[player],
              week: this.weeklyScores.length - parseInt(i)
            };
          }
        }

        // Set highest weekly score ever
        if (!highestWeeklyScoreEver) {
          highestWeeklyScoreEver = {
            player: player,
            score: week[player],
            week: this.weeklyScores.length - parseInt(i)
          };
        }
        else {
          if (week[player] >= highestWeeklyScoreEver.score) {
            highestWeeklyScoreEver = {
              player: player,
              score: week[player],
              week: this.weeklyScores.length - parseInt(i)
            };
          }
        }

        // Sum weekly scores
        if (!(player in averageWeeklyScores)) {
          averageWeeklyScores[player] = 0.0;
        }
        averageWeeklyScores[player] += week[player];

        // Set low score for the week
        if (week[player] <= lowScore) {
          lowScore = week[player];
        }
      }
  
      let numberOfWinners = 0.0;
      for (let player in week) {
        if (week[player] == lowScore) {
          numberOfWinners++;
        }
      }
  
      for (let player in week) {
        if (week[player] == lowScore) {
          if (!(player in wins)) {
            wins[player] = 0.0;
          }
          wins[player] = wins[player] + 1.0/numberOfWinners;
        }
      }
    }

    for (let player in averageWeeklyScores) {
      averageWeeklyScores[player] = averageWeeklyScores[player]/(this.weeklyScores.length-1);
    }

    this.seasonStandings = lib.sortScores(wins, "desc");
    this.seasonStats = {
      lowestWeeklyScoreEver,
      highestWeeklyScoreEver,
      averageWeeklyScores: this.sortScores(averageWeeklyScores, "asc")
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
    scoresSorted.sort((a, b) => a[1] != b[1] ? (
      dir == "asc" ? a[1] - b[1] : b[1] - a[1]
    ) : a[0].localeCompare(b[0]));

    const result = {};
    scoresSorted.forEach((item) => result[item[0]] = item[1]);
    return result;
  }

// ========================================

  getData = async (url) => {
    const response = await fetch(url);
    return await response.json();
  }
}
