const lib = new StocksAndBondsLib();

const numberOfYears = 10;
const marketCardsCount = 36;
const dealtMarketCards = [];

// ========================================

function StocksAndBondsMarket(props) {
  const marketCard = props.game.marketCard;
  const market = marketCard.market ? marketCard.market + " Market" : null;
  const marketImage = marketCard.market ? "img/market/" + marketCard.market + ".png" : null;

  const marketChanges = [];
  for (let companyKey in marketCard.changes) {
    marketChanges.push(<li key={"marketChange"+companyKey}>{companyKey} : {marketCard.changes[companyKey]}</li>);
  }

  return (
    <div className="current">
      <h1>{market}</h1>
      <div><img width="150px" height="150px" src={marketImage} alt=""/></div>
      <div style={{textAlign: "center", fontSize: "18px"}}>{marketCard.message}</div>
      <div style={{textAlign: "center", fontSize: "18px"}}><ul>{marketChanges}</ul></div>
      <div>{lib.StocksAndBondsButton(() => props.f(), "Draw Market Card")}</div>
    </div>
  );
}

// ========================================

function StocksAndBondsCurrentPrices(props) {
  const year = props.game.year;
  const currentPrices = props.game.currentPrices;

  const currentPriceRows = [];
  for (let companyKey in currentPrices) {
    const currentPrice = currentPrices[companyKey];

    const changeStyle = lib.getChangeStyle(currentPrice.change);
    const marketChangeStyle = lib.getChangeStyle(currentPrice.marketChange);
    const priceStyle = currentPrice.split ? {backgroundColor: "Orange", color: "White"} : {};
    const rowStyle = currentPrice.selected ? {border: "1px solid black"} : {};

    currentPriceRows.push((
      <tr style={rowStyle} key={"currentPrice"+companyKey}>
        <td className="boldElement">{companyKey}</td>
        <td className="boldElement" style={priceStyle}>{currentPrice.price}</td>
        <td className="boldElement" style={changeStyle.changeStyle}>{changeStyle.changeSymbol + currentPrice.change}</td>
        <td className="boldElement" style={marketChangeStyle.changeStyle}>{marketChangeStyle.changeSymbol + currentPrice.marketChange}</td>
        <td>{currentPrice.previousPrice}</td>      
      </tr>
    ));
  }

  return (
    <div className="current">
      <h1>Year {year}</h1>
      <h2>Current Price Board</h2>
      <div>
        <table>
          <tbody>
            <tr>
              <th>Company</th><th>Current Price</th><th>Change</th><th>Situation Change</th><th>Previous Price</th>
            </tr>
            {currentPriceRows}
          </tbody>
        </table>
      </div>
      <br/>
      <div>{lib.StocksAndBondsButton(() => props.f(), "Reveal Price")}</div>
    </div>
  );
}
  
// ========================================

function StocksAndBondsDice(props) {
  const dice = props.game.dice;

  return (
    <div className="current">
      <h1>{dice.die1 + dice.die2}</h1>
      <div><img src={"img/dice/" + dice.die1 + ".png"} alt=""/><img src={"img/dice/" + dice.die2 + ".png"} alt=""/></div>
      <div>{lib.StocksAndBondsButton(() => props.f(), "Roll Dice")}</div>
    </div>
  );
}

// ========================================

function StocksAndBondsHistoricalPrices(props) {
  const historicalPrices = props.history;

  const headerCells = [];
  let populateHeaderCells = true;
  const historicalPriceRows = [];
  for (let companyKey in historicalPrices) {
    let dividends = true;
    const historicalPriceCells = [];

    for (let i = 0; i < numberOfYears; i++) {
      if (populateHeaderCells) {
        headerCells.push(<th key={"week"+i}>Week {i+1}</th>);
      }

      if (lib.isCompanyPriced(companyKey)) {
        const historicalPrice = i < historicalPrices[companyKey].length ? historicalPrices[companyKey][i] : null;
        if (historicalPrice) {
          const priceStyle = historicalPrice.split ? {backgroundColor: "Orange", color: "White"} : {};
          dividends = historicalPrice.dividends;
          historicalPriceCells.push(<td key={"historicalPrice"+companyKey+i} style={priceStyle}>{historicalPrice.price}</td>);
        }
        else {
          historicalPriceCells.push(<td key={"historicalPrice"+companyKey+i}>{null}</td>);
        }
      }
      else {
        historicalPriceCells.push(<td key={"historicalPrice"+companyKey+i}>PAR</td>);
      }
    }

    const rowStyle = !dividends ? {backgroundColor: "Gray"} : {};
    historicalPriceRows.push((
      <tr style={rowStyle} key={"historicalPrice"+companyKey}>
        <td className="boldElement">{companyKey}</td>
        {historicalPriceCells}
      </tr>
    ));
    populateHeaderCells = false;
  }

  return (
    <div className="historical">
      <h2>Historical Price Board</h2>
      <table>
        <tbody>
          <tr>
            <th>Company</th>{headerCells}
          </tr>
          {historicalPriceRows}
        </tbody>
      </table>
    </div>
  );
}

// ========================================

class StocksAndBondsGameBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      setup: {},
      game: {
        marketCard: {market: null, message: "Draw a card", changes: []},
        dice: {die1: 2, die2: 6},
        year: 0
      },
      history: null
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

    //const url = "http://localhost:8000/";
    const url = "https://www.squishyproductions.com/";
    const dataToFetch = ["companies", "marketCards", "marketCalculator"];
    for (let i = 0; i < dataToFetch.length; i++){
      const data = await lib.getData(url + "stocks_and_bonds/data/" + dataToFetch[i] + ".json");
      setup[dataToFetch[i]] = data;
    }
    this.setState({setup});
    lib.init(setup);

    const game = JSON.parse(JSON.stringify(this.state.game));
    if (!game.currentPrices || !game.currentCompany) {
      const initialPrices = lib.getInitialPrices();
      const currentCompany = lib.getFirstCompany();
      game.currentPrices = initialPrices;
      game.currentCompany = currentCompany;
      this.setState({game})
    }

    if (!this.state.history) {
      const history = lib.getInitialHistories();
      this.setState({history})
    }
  }

// ========================================

  drawMarketCard() {
    const game = JSON.parse(JSON.stringify(this.state.game));

    if (dealtMarketCards.length == marketCardsCount) {
      this.setState({
        game: {marketCard: {market: null, message: "Out of cards", changes: []}}
      });
    }
    else{
      let r = Math.floor(Math.random() * marketCardsCount);
      while (dealtMarketCards.includes(r)) {
        r = Math.floor(Math.random() * marketCardsCount);
      }
      dealtMarketCards.push(r);

      const marketCard = lib.getMarketCard(r);
      game.marketCard = marketCard;
      this.setState({game});
    }
  }

// ========================================

  calculatePrice() {
    const game = JSON.parse(JSON.stringify(this.state.game));

    const currentPrices = JSON.parse(JSON.stringify(game.currentPrices));
    const currentCompany = game.currentCompany;

    const companyPriceData = currentPrices[currentCompany];
    const currentYear = lib.isFirstCompany(currentCompany) ? this.state.game.year + 1 : this.state.game.year;
    const totalRoll = this.state.game.dice.die1 + this.state.game.dice.die2;
    const marketChange = this.state.game.marketCard.changes.hasOwnProperty(currentCompany) ? this.state.game.marketCard.changes[currentCompany] : 0;
    const price = companyPriceData.price + lib.getMarketChange(totalRoll, this.state.game.marketCard.market, currentCompany) + marketChange;

    const latestCompanyPriceData = {
      price: price <= 150 ? (price < 0 ? 0 : price) : Math.ceil(price/2.0),
      change: lib.getMarketChange(totalRoll, this.state.game.marketCard.market, currentCompany),
      marketChange: marketChange != 0 ? marketChange : "-",
      previousPrice: companyPriceData.price,
      split: price > 150,
      dividends: price > 50,
      selected: false
    };

    const nextCompany = lib.getNextCompany(currentCompany);

    currentPrices[currentCompany] = latestCompanyPriceData;
    currentPrices[nextCompany].selected = true;
    game.currentPrices = currentPrices;
    game.currentCompany = nextCompany;
    game.year = currentYear;
    this.setState({game});

    const history = JSON.parse(JSON.stringify(this.state.history));
    history[currentCompany].push(latestCompanyPriceData);
    this.setState({history});
  }

// ========================================

  rollDice() {
    const game = JSON.parse(JSON.stringify(this.state.game));

    const dice = {die1: Math.floor(Math.random() * 6) + 1, die2: Math.floor(Math.random() * 6) + 1};
    game.dice = dice;
    this.setState({game});
  }

// ========================================

  render() {
    if (this.state.setup.companies && this.state.setup.marketCards && this.state.setup.marketCalculator && this.state.game.currentPrices && this.state.game.currentCompany) {

      return (
        <div className="grid-container">
          <main className="main">

            <div className="main-current">
              <StocksAndBondsMarket game={this.state.game} f={() => this.drawMarketCard()} />
              <StocksAndBondsCurrentPrices game={this.state.game} f={() => this.calculatePrice()} />
              <StocksAndBondsDice game={this.state.game} f={() => this.rollDice()} />
            </div>

            <div className="main-historical">
              <StocksAndBondsHistoricalPrices history={this.state.history} />
            </div>

          </main>
        </div>
      );
    }

    return <p>Loading...</p>
  }

}

// ========================================

ReactDOM.render(<StocksAndBondsGameBoard/>, document.getElementById('root'));
