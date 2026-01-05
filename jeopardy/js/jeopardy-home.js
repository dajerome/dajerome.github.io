const year = 2026;
const lib = new JeopardyLib();

// ========================================

function JeopardyWeeklyScores(props) {
  const icon = <img src="svg/leader.svg" alt="leader" width="50px" height="50px"/>;

  const latestWeekIndex = 0;
  const latestWeek = props.scoreData.weeklyScores[latestWeekIndex];

  const weeklyScores = [];
  for (let player in latestWeek) {
    const playerScores = latestWeek[player];
    weeklyScores.push((
      <tr key={player}>
        <td>{player}</td>
        <td>{lib.toCurrency(playerScores.post)}</td>
        <td>{lib.toCurrency(playerScores.pre)}</td>
      </tr>
    ));
  }

  return (
    <div style={{textAlign: "center"}}>
      <h2>{icon} {year} Week {props.scoreData.weeklyScores.length} Scores </h2>
      <table style={{width: "100%"}}>
        <tbody>
          <tr>
            <th style={{width: "40%"}}>Player</th><th style={{width: "30%"}}>Post FJ</th><th style={{width: "30%"}}>Pre FJ</th>
          </tr>
          {weeklyScores}
        </tbody>
      </table>
    </div>
  );
}

// ========================================

function JeopardySeasonStandings(props) {
  const icon = <img src="svg/standings.svg" alt="standings" width="50px" height="50px"/>;

  const seasonTotals = [];
  for (let player in props.scoreData.seasonStandings) {
    const playerTotals = props.scoreData.seasonStandings[player];
    seasonTotals.push((
      <tr key={player}>
        <td>{player}</td>
        <td>{lib.toCurrency(playerTotals.post)}</td>
        <td>{lib.toCurrency(playerTotals.pre)}</td>
      </tr>
    ));
  }

  return (
    <div style={{textAlign: "center"}}>
      <h2>{icon} {year} Season Totals</h2>
      <table style={{width: "100%"}}>
        <tbody>
          <tr>
            <th style={{width: "40%"}}>Player</th><th style={{width: "30%"}}>Post FJ</th><th style={{width: "30%"}}>Pre FJ</th>
          </tr>
          {seasonTotals}
        </tbody>
      </table>
    </div>
  );
}

// ========================================

function JeopardySeasonStats(props) {
  const icon = <img src="svg/stats.svg" alt="stats" width="50px" height="50px"/>;

  let highest = <tr><td/><td/><td/></tr>
  const highestWeeklyScoreEver = props.scoreData.seasonStats.highestWeeklyScoreEver;
  if (highestWeeklyScoreEver != null) {
    highest = (
      <tr key={highestWeeklyScoreEver.player}>
        <td>{highestWeeklyScoreEver.player}</td>
        <td>{highestWeeklyScoreEver.score}</td>
        <td>{highestWeeklyScoreEver.week}</td>
      </tr>
    )
  }

  const averageScores = [];
  for (let player in props.scoreData.seasonStats.averageWeeklyScores) {
    const playerScore = props.scoreData.seasonStats.averageWeeklyScores[player];
    averageScores.push((
      <tr key={player}>
        <td>{player}</td>
        <td>{lib.toCurrency(playerScore.post)}</td>
        <td>{lib.toCurrency(playerScore.pre)}</td>
      </tr>
    ));
  }

  return (
    <div style={{textAlign: "center"}}>
      <h2>{icon} {year} Season Stats</h2>
      <table style={{width: "100%"}}>
        <tbody>
          <tr>
            <th colSpan={3} style={{width: "100%"}}>Highest Weekly Post FJ Score</th>
          </tr>
          <tr>
            <th style={{width: "40%"}}>Player</th><th style={{width: "30%"}}>Score</th><th style={{width: "30%"}}>Week</th>
          </tr>
          {highest}
          <tr>
            <th colSpan={3} style={{width: "100%"}}>Average Weekly Scores</th>
          </tr>
          <tr>
            <th style={{width: "40%"}}>Player</th><th style={{width: "30%"}}>Post FJ</th><th style={{width: "30%"}}>Pre FJ</th>
          </tr>
          {averageScores}
        </tbody>
      </table>
    </div>
  );
}

// ========================================

class JeopardyHome extends React.Component {

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
    const fileId = "1MEI1ybqAIqR7g_pqE7IRN1CS9gaG4387DjzD3SfTnHM"
    const apiKey = "AIzaSyB2I5GACS31M__45rf7CItgkYrmn_ulOYQ"
    const mimeType = "text/plain"
    const url = "https://www.googleapis.com/drive/v3/files/"+fileId+"/export?key="+apiKey+"&mimeType="+mimeType
    const data = await lib.getData(url);
    setup.scores = data;
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

            <JeopardyWeeklyScores scoreData={this.state.scoreData} />

            <br/>
            <br/>

            <JeopardySeasonStandings scoreData={this.state.scoreData} />

            <br/>
            <br/>

            <JeopardySeasonStats scoreData={this.state.scoreData} />

            <br/>
            <br/>

          </main>
        </div>

      );
    }

    return <p>Loading...</p>
  }

}

// ========================================

ReactDOM.render(<JeopardyHome/>, document.getElementById('root'));
