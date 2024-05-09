const lib = new WordleLib();

// ========================================

function WordleWeeklyLeaderboard(props) {
  const latestWeekIndex = props.scores.length - 1;
  const latestWeek = props.scores[latestWeekIndex];
  const sortedScores = lib.getWeeklyScores(latestWeek);

  const weeklyScores = [];
  for (let player in sortedScores) {
    const playerScore = sortedScores[player];
    weeklyScores.push((
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
          {weeklyScores}
        </tbody>
      </table>
    </div>
  );
}

// ========================================

function WordleSeasonStandings(props) {
  const wins = {};
  for (let week in props.scores.slice(0,-1)) {
    const sortedScores = lib.getWeeklyScores(props.scores[week]);

    let lowScore = 50;
    for (let k in sortedScores) {
      if (sortedScores[k] <= lowScore) {
        lowScore = sortedScores[k];
      }
    }

    let numberOfWinners = 0.0;
    for (let k in sortedScores) {
      if (sortedScores[k] == lowScore) {
        numberOfWinners++;
      }
    }

    for (let k in sortedScores) {
      if (sortedScores[k] == lowScore) {
        if (!(k in wins)) {
          wins[k] = 0.0;
        }
        wins[k] = wins[k] + 1.0/numberOfWinners;
      }
    }
  }
  const sortedWins = lib.sortScores(wins, "desc");

  const seasonWins = [];
  for (let player in sortedWins) {
    const playerWins = sortedWins[player];
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

function WordleHistoricalStats(props) {
  return (
    <div style={{textAlign: "center"}}>
      <h2>Historical Stats</h2>
      <table style={{width: "100%"}}>
        <tbody>
          <tr>
            <th style={{width: "60%"}}>Coming Soon!</th>
          </tr>
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
      setup: {}
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
    const url = "http://www.squishyproductions.com/";
    const dataToFetch = ["scores"];
    for (let i = 0; i < dataToFetch.length; i++){
      const data = await lib.getData(url + "wordle/data/" + dataToFetch[i] + ".json");
      setup[dataToFetch[i]] = data;
    }
    this.setState({setup});
  }

// ========================================

  render() {
    if (this.state.setup.scores) {

      return (
        <div className="grid-container">
          <main className="main">

            <WordleWeeklyLeaderboard scores={this.state.setup.scores} />

            <br/>
            <br/>

            <WordleSeasonStandings scores={this.state.setup.scores} />

            <br/>
            <br/>

            <WordleHistoricalStats state={this.state} />

          </main>
        </div>

      );
    }

    return <p>Loading...</p>
  }

}

// ========================================

ReactDOM.render(<WordleHome/>, document.getElementById('root'));
