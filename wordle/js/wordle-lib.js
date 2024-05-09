class WordleLib {

  constructor () {}

// ========================================

  sortScores = (scores, dir) => {
    const scoresSorted = []
    for (let k in scores) {
      scoresSorted.push([k, scores[k]]);
    }
    scoresSorted.sort((a, b) => a[1] != b[1] ? (
      dir == "asc" ? a[1] - b[1] : b[1] - a[1]
    ) : a[0][0] - b[0][0]);

    const result = {};
    scoresSorted.forEach((item) => result[item[0]] = item[1]);
    return result;
  }

// ========================================

  getWeeklyScores = (scores) => {
    const sums = Object.fromEntries(
      Object.entries(scores).map(
        ([k, v], i) => [k, v.reduce((partialSum, a) => partialSum + a -4, 0)]
      )
    );
  
    return this.sortScores(sums, "asc");
  }

// ========================================

  getData = async (url) => {
    const response = await fetch(url);
    return await response.json();
  }
}
