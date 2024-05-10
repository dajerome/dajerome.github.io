const lib = new WordleLib();

// ========================================

function WordleWeeklyLeaderboard(props) {
  const latestWeekIndex = props.scoreData.weeklyScores.length - 1;
  const latestWeek = props.scoreData.weeklyScores[latestWeekIndex];

  const weeklyScore = [];
  for (let player in latestWeek) {
    const playerScore = latestWeek[player];
    weeklyScore.push((
      <tr key={player}>
        <td>{player}</td>
        <td>{playerScore}</td>
      </tr>
    ));
  }

  return (
    <div style={{textAlign: "center"}}>
      <h2>Week {latestWeekIndex+1} Leaderboard</h2>
      <table style={{width: "100%"}}>
        <tbody>
          <tr>
            <th style={{width: "60%"}}>Player</th><th style={{width: "40%"}}>Score</th>
          </tr>
          {weeklyScore}
        </tbody>
      </table>
    </div>
  );
}

// ========================================

function WordleSeasonStandings(props) {
  const seasonWins = [];
  for (let player in props.scoreData.seasonStandings) {
    const playerWins = props.scoreData.seasonStandings[player];
    seasonWins.push((
      <tr key={player}>
        <td>{player}</td>
        <td>{playerWins.toFixed(3)}</td>
      </tr>
    ));
  }

  return (
    <div style={{textAlign: "center"}}>
      <h2>Season Standings</h2>
      <table style={{width: "100%"}}>
        <tbody>
          <tr>
            <th style={{width: "60%"}}>Player</th><th style={{width: "40%"}}>Wins</th>
          </tr>
          {seasonWins}
        </tbody>
      </table>
    </div>
  );
}

// ========================================

function WordleSeasonStats(props) {
  const lowestWeeklyScoreEver = props.scoreData.seasonStats.lowestWeeklyScoreEver;
  const lowest = (
    <tr key={lowestWeeklyScoreEver.player}>
      <td>{lowestWeeklyScoreEver.player}</td>
      <td>{lowestWeeklyScoreEver.score}</td>
      <td>{lowestWeeklyScoreEver.week}</td>
    </tr>
  )

  const highestWeeklyScoreEver = props.scoreData.seasonStats.highestWeeklyScoreEver;
  const highest = (
    <tr key={highestWeeklyScoreEver.player}>
      <td>{highestWeeklyScoreEver.player}</td>
      <td>{highestWeeklyScoreEver.score}</td>
      <td>{highestWeeklyScoreEver.week}</td>
    </tr>
  )

  const averageScores = [];
  for (let player in props.scoreData.seasonStats.averageWeeklyScores) {
    const playerScore = props.scoreData.seasonStats.averageWeeklyScores[player];
    averageScores.push((
      <tr key={player}>
        <td>{player}</td>
        <td colSpan={2}>{playerScore.toFixed(3)}</td>
      </tr>
    ));
  }

  return (
    <div style={{textAlign: "center"}}>
      <h2>Season Stats</h2>
      <table style={{width: "100%"}}>
        <tbody>
          <tr>
            <th colSpan={3} style={{width: "100%"}}>Lowest Weekly Score</th>
          </tr>
          <tr>
            <th style={{width: "60%"}}>Player</th><th style={{width: "20%"}}>Score</th><th style={{width: "20%"}}>Week</th>
          </tr>
          {lowest}
          <tr>
            <th colSpan={3} style={{width: "100%"}}>Highest Weekly Score</th>
          </tr>
          <tr>
            <th style={{width: "60%"}}>Player</th><th style={{width: "20%"}}>Score</th><th style={{width: "20%"}}>Week</th>
          </tr>
          {highest}
          <tr>
            <th colSpan={3} style={{width: "100%"}}>Average Weekly Scores</th>
          </tr>
          <tr>
            <th style={{width: "60%"}}>Player</th><th colSpan={2} style={{width: "40%"}}>Score</th>
          </tr>
          {averageScores}
        </tbody>
      </table>
    </div>
  );
}

// ========================================

class WordleHome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      setup: {},
      scoreData: {}
    };
  }

// ========================================

  async componentDidMount() {
    console.log("CDM - start");
    await this.setup();
    console.log(this.state);
    console.log("CDM - end");
  }

// ========================================

  async setup() {
    const setup = JSON.parse(JSON.stringify(this.state.setup));

    //const url = "http://127.0.0.1:3000/";
    const url = "https://www.squishyproductions.com/";
    const dataToFetch = ["scores"];
    for (let i = 0; i < dataToFetch.length; i++){
      const data = await lib.getData(url + "wordle/data/" + dataToFetch[i] + ".json");
      setup[dataToFetch[i]] = data;
    }
    this.setState({setup});
    lib.init(setup);

    const scoreData = JSON.parse(JSON.stringify(this.state.scoreData));
    scoreData.weeklyScores = lib.getWeeklyScores()
    scoreData.seasonStandings = lib.getSeasonStandings();
    scoreData.seasonStats = lib.getSeasonStats();
    this.setState({scoreData});
  }

// ========================================

  render() {
    if (
      this.state.setup.scores
      && this.state.scoreData.weeklyScores 
      && this.state.scoreData.seasonStandings
      && this.state.scoreData.seasonStats
    ) {

      return (
        <div className="grid-container">
          <main className="main">

            <WordleWeeklyLeaderboard scoreData={this.state.scoreData} />

            <br/>
            <br/>

            <WordleSeasonStandings scoreData={this.state.scoreData} />

            <br/>
            <br/>

            <WordleSeasonStats scoreData={this.state.scoreData} />

          </main>
        </div>

      );
    }

    return <p>Loading...</p>
  }

}

// ========================================

ReactDOM.render(<WordleHome/>, document.getElementById('root'));
