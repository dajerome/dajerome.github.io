const lib = new StocksAndBondsLib();

// ========================================

const companyCount = 9;
const marketCardsCount = 36;
let dealtMarketCards = [];

// ========================================

function PriceRow(props) {
  const weeklyPrice = props.weeklyPrices[props.week] ? props.weeklyPrices[props.week] : props.weeklyPrices[props.week - 1]

  let changeStyle = lib.getChangeStyle(weeklyPrice.change);
  let marketChangeStyle = lib.getChangeStyle(weeklyPrice.marketChange);

  let priceStyle = {};
  if (weeklyPrice.split) {
    priceStyle = {backgroundColor: "Orange", color: "White"};
  }

  let rowStyle = {};
  if (props.isCurrentCompany) {
    rowStyle = {border: "1px solid black"};
  }

  return (
    <tr style={rowStyle}>
      <td className="boldElement">{props.company.shortName}</td>
      <td className="boldElement" style={priceStyle}>{weeklyPrice.price}</td>
      <td className="boldElement" style={changeStyle.changeStyle}>{changeStyle.changeSymbol + weeklyPrice.change}</td>
      <td className="boldElement" style={marketChangeStyle.changeStyle}>{marketChangeStyle.changeSymbol + weeklyPrice.marketChange}</td>
      <td>{weeklyPrice.previousPrice}</td>      
    </tr>
  );
}

// ========================================

function HistoricalPriceRow(props) {
  let historicalPrices = [];

  for (let i = 1; i <= 10; i++){
    let priceStyle = {};
    if (props.weeklyPrices[i]) {
      if (props.weeklyPrices[i].split) {
        priceStyle = {backgroundColor: "Orange", color: "White"};
      }
      historicalPrices.push(<td key={"historicalPrice" + i} style={priceStyle}>{props.weeklyPrices[i].price}</td>);
    }
    else {
      historicalPrices.push(<td key={"historicalPrice" + i}>{null}</td>);
    }
  }

  let rowStyle = {};
  if (props.weeklyPrices[props.week] && props.weeklyPrices[props.week].noDividends) {
    rowStyle = {backgroundColor: "Gray"};
  }

  return (
    <tr style={rowStyle}>
      <td className="boldElement">{props.company.shortName}</td>
      {historicalPrices}
    </tr>
  );
}

// ========================================

function StocksAndBondsButton(props) {
  return (
    <div>
      <button className="button" onClick={() => props.f()}>{props.txt}</button>
    </div>
  );
}

// ========================================

class StocksAndBondsGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      week: 0,
      marketCard: {market: "Bull", message: null, changes: []},
      dice: {dieValue1: 3, dieValue2: 4},
      currentCompany: 0,
      weeklyPriceLists: Array(10).fill([
        {
          price: 100,
          change: "-",
          marketChange: "-",
          previousPrice: null,
          split: false,
          noDividends: false
        }
      ])
    };
  }

// ========================================

  drawMarketCard() {
    if (dealtMarketCards.length == marketCardsCount) {
      this.setState({
        marketCard: {market: null, message: "out of market cards", changes: []}
      });
    }
    else{
      let r = Math.floor(Math.random() * marketCardsCount);
      while (dealtMarketCards.includes(r)) {
        r = Math.floor(Math.random() * marketCardsCount);
      }
      dealtMarketCards.push(r);

      let marketCard = lib.getMarketCard(r);
      this.setState({
        marketCard: marketCard
      });
    }
  }

// ========================================

  rollDice() {
    this.setState({
      dice: {dieValue1: Math.floor(Math.random() * 6) + 1, dieValue2: Math.floor(Math.random() * 6) + 1}
    });
  }

// ========================================

  calculatePrice() {
    const currentWeek = this.state.currentCompany == 0 ? this.state.week + 1 : this.state.week;
    const totalRoll = this.state.dice.dieValue1 + this.state.dice.dieValue2;
    const weeklyPriceLists = this.state.weeklyPriceLists.slice();
    const companyPriceList = this.state.weeklyPriceLists[this.state.currentCompany].slice();

    const company = lib.getCompany(this.state.currentCompany);
    const companyName = company.shortName;

    const marketChange = this.state.marketCard.changes.hasOwnProperty(companyName) ? this.state.marketCard.changes[companyName] : 0;

    const price = companyPriceList[currentWeek-1].price + lib.getMarketChange(totalRoll, this.state.marketCard.market, this.state.currentCompany) + marketChange;

    const weeklyPrice = {
      price: price <= 150 ? (price < 0 ? 0 : price) : Math.ceil(price/2.0),
      change: lib.getMarketChange(totalRoll, this.state.marketCard.market, this.state.currentCompany),
      marketChange: marketChange != 0 ? marketChange : "-",
      previousPrice: companyPriceList[currentWeek - 1].price,
      split: price > 150,
      noDividends: price <= 50
    };

    companyPriceList.push(weeklyPrice);
    weeklyPriceLists[this.state.currentCompany] = companyPriceList;

    this.setState({
      weeklyPriceLists: weeklyPriceLists,
      currentCompany: (this.state.currentCompany == (companyCount - 1)) ? 0 : this.state.currentCompany + 1,
      week: currentWeek
    });
  }

// ========================================

  render() {
    let currentPrices = [];
    let historicalPrices = [];
    let marketChanges = [];
    for (let i = 0; i < companyCount; i++) {
      const company = lib.getCompany(i);
      const weeklyPrices = this.state.weeklyPriceLists[i];

      currentPrices.push(
        <PriceRow
          key={"currentPriceRow" + i}
          company={company}
          weeklyPrices={weeklyPrices}
          week={this.state.week}
          isCurrentCompany={i==this.state.currentCompany}
        />
      );

      historicalPrices.push(
        <HistoricalPriceRow
          key={"historicalPriceRow" + i}
          company={company}
          weeklyPrices={weeklyPrices}
          week={this.state.week}
        />
      );
    }

    for (let companyName in this.state.marketCard.changes) {
      marketChanges.push(<li key={companyName}>{companyName} : {this.state.marketCard.changes[companyName]}</li>)
    }

    return (
      <div className="grid-container">
        <main className="main">

          <div className="main-current">
            <div className="current">
              <h1>{this.state.marketCard.market} Market</h1>
              <div><img width="150px" height="150px" src={this.state.marketCard.market ? "img/market/" + this.state.marketCard.market + ".png" : null} alt=""/></div>
              <div style={{textAlign: "center", fontSize: "18px"}}>{this.state.marketCard.message}</div>
              <div style={{textAlign: "center", fontSize: "18px"}}><ul>{marketChanges}</ul></div>
              <div><StocksAndBondsButton f={() => this.drawMarketCard()} txt={"Draw Market Card"}/></div>
            </div>

            <div className="current">
              <h1>Week {this.state.week}</h1>
              <h2>Current Price Board</h2>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <th>Company</th><th>Current Price</th><th>Change</th><th>Situation Change</th><th>Previous Price</th>
                    </tr>
                    {currentPrices}
                  </tbody>
                </table>
              </div>
              <br/>
              <div><StocksAndBondsButton f={() => this.calculatePrice()} txt={"Reveal Price"}/></div>
            </div>

            <div className="current">
              <h1>{this.state.dice.dieValue1 + this.state.dice.dieValue2}</h1>
              <div><img src={"img/dice/" + this.state.dice.dieValue1 + ".png"} alt=""/><img src={"img/dice/" + this.state.dice.dieValue2 + ".png"} alt=""/></div>
              <div><StocksAndBondsButton f={() => this.rollDice()} txt={"Roll Dice"}/></div>
            </div>
          </div>

          <div className="main-historical">
            <div className="historical">
              <h2>Historical Price Board</h2>
                <table>
                  <tbody>
                    <tr>
                      <th>Company</th><th>Week 1</th><th>Week 2</th><th>Week 3</th><th>Week 4</th><th>Week 5</th><th>Week 6</th><th>Week 7</th><th>Week 8</th><th>Week 9</th><th>Week 10</th>
                    </tr>
                    <tr>
                      <td className="boldElement">C City Bonds</td>
                      <td>PAR</td><td>PAR</td><td>PAR</td><td>PAR</td><td>PAR</td><td>PAR</td><td>PAR</td><td>PAR</td><td>PAR</td><td>PAR</td>
                    </tr>
                    {historicalPrices}
                  </tbody>
                </table>
            </div>
          </div>

        </main>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<StocksAndBondsGame/>, document.getElementById('root'));
