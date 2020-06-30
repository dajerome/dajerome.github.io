const companyCount = 9;

const companyMap = {
  "Growth Corp": 0,
  "Metro Prop": 1,
  "Pioneer Mult": 2,
  "Shady Brooks": 3,
  "Stryker Drlg": 4,
  "Tri City Tran": 5,
  "United Auto": 6,
  "Uranium Ent": 7,
  "Valley Power": 8
}

const changeMap = {
  Bear: {
    roll2:  [12, 14, 13, 10, 10, 20, 21, 25, 8],
    roll3:  [7, -6, 10, -10, 30, 6, -19, 22, -2],
    roll4:  [9, 10, 7, -5, -20, 12, 21, 18, 7],
    roll5:  [7, 8, 5, -6, -40, 3, 16, -14, 4],
    roll6:  [8, 6, 4, -4, 40, 8, 4, -12, 3],
    roll7:  [6, 4, 3, 3, -15, 5, 8, -8, 5],
    roll8:  [5, 7, -1, -3, 45, 6, -10, 10, 4],
    roll9:  [-2, 6, -3, -8, -20, 7, 10, 14, 6],
    roll10: [11, 11, -5, -7, 30, 10, -11, -18, -4],
    roll11: [-5, 13, -8, 6, 25, 4, 18, -22, -4],
    roll12: [-8, -10, -10, -15, -20, -20, -23, -25, -7]
  },
  Bull: {
    roll2:  [-2, -10, -7, -9, -2, -9, -7, -16, -4],
    roll3:  [26, 16, 25, 8, -14, 21, 14, -4, 17],
    roll4:  [18, 23, 11, 12, 46, 18, -5, 34, 15],
    roll5:  [23, 28, -2, 11, 56, 19, 30, 29, 14],
    roll6:  [20, 15, 15, 7, -20, 15, 13, -10, 12],
    roll7:  [17, 21, 13, -2, 37, 23, 23, 19, 14],
    roll8:  [19, 24, 17, 9, -5, 26, 13, -7, 15],
    roll9:  [11, 18, 14, 11, 67, 15, 22, 18, 13],
    roll10: [13, 31, 1, 14, -11, 18, 18, -14, 10],
    roll11: [14, -8, 19, -1, -9, 25, -10, 13, 19],
    roll12: [24, 24, 23, 20, 51, 27, 38, 33, 18]
  }
};

function PriceRow(props) {
  const weeklyPrice = props.weeklyPrices[props.week] ? props.weeklyPrices[props.week] : props.weeklyPrices[props.week - 1]
  let changeStyle = {};
  let changeSymbol = "";
  let priceStyle = {};

  if (weeklyPrice.change != "-") {
    if (weeklyPrice.change < 0) {
      changeStyle = {backgroundColor: "Red", color: "White"};
    }
    else if (weeklyPrice.change > 0) {
      changeStyle = {backgroundColor: "Green", color: "White"};
      changeSymbol = "+";
    }
    else {
      changeStyle = {};
    }
  }

  if (weeklyPrice.split) {
    priceStyle = {backgroundColor: "Orange", color: "White"};
  }

  return (
    <tr>
      <td className="boldElement">{props.companyName}</td>
      <td className="boldElement" style={priceStyle}>{weeklyPrice.price}</td>
      <td className="boldElement" style={changeStyle}>{changeSymbol + weeklyPrice.change}</td>
      <td>{weeklyPrice.previousPrice}</td>      
    </tr>
  );
}

function HistoricalPriceRow(props) {
  let historicalPrices = [];
  let noDividendsStyle = {};

  if (props.weeklyPrices[props.week] && props.weeklyPrices[props.week].noDividends) {
    noDividendsStyle = {backgroundColor: "Gray"};
  }

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

  return (
    <tr style={noDividendsStyle}>
      <td className="boldElement">{props.companyName}</td>
      {historicalPrices}
    </tr>
  );
}

function MarketToggle(props) {
  return (
    <div>
      <label className="switch">
        <input type="checkbox" onChange={() => props.updateMarket()}/>
        <span className="slider"></span>
      </label>
    </div>
  );
}

function DiceRoll(props) {
  return (
    <div>
      <button className="button" onClick={() => props.rollDice()}>Roll Dice</button>
    </div>
  );
}

function PriceReveal(props) {
  return (
    <div>
      <button className="button" onClick={() => props.calculatePrice()}>Reveal Price</button>
    </div>
  );
}

class StocksAndBondsGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      week: 0,
      market: "Bull",
      dieValue1: 3,
      dieValue2: 4,
      currentCompany: 0,
      weeklyPriceLists: Array(10).fill([
        {
          price: 100,
          change: "-",
          previousPrice: null,
          split: false,
          noDividends: false
        }
      ])
    };
  }

  updateMarket() {
    this.setState({market: (this.state.market == "Bull") ? "Bear" : "Bull"});
  }

  rollDice() {
    this.setState({
      dieValue1: Math.floor(Math.random() * 6) + 1,
      dieValue2: Math.floor(Math.random() * 6) + 1
    });
  }

  calculatePrice() {
    const currentWeek = this.state.currentCompany == 0 ? this.state.week + 1 : this.state.week;
    const totalRoll = this.state.dieValue1 + this.state.dieValue2;
    const weeklyPriceLists = this.state.weeklyPriceLists.slice();
    const companyPriceList = this.state.weeklyPriceLists[this.state.currentCompany].slice();

    const price = companyPriceList[currentWeek-1].price + changeMap[this.state.market]["roll" + totalRoll][this.state.currentCompany];

    const weeklyPrice = {
      price: price <= 150 ? (price < 0 ? 0 : price) : Math.ceil(price/2.0),
      change: changeMap[this.state.market]["roll" + totalRoll][this.state.currentCompany],
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

  render() {
    let currentPrices = [];
    let historicalPrices = [];
    for (let company in companyMap) {
      const weeklyPrices = this.state.weeklyPriceLists[companyMap[company]];
      currentPrices.push(<PriceRow key={"currentPriceRow" + companyMap[company]} companyName={company} weeklyPrices={weeklyPrices} week={this.state.week}/>);
      historicalPrices.push(<HistoricalPriceRow key={"historicalPriceRow" + companyMap[company]} companyName={company} weeklyPrices={weeklyPrices} week={this.state.week}/>);
    }

    return (
      <div className="grid-container">
        <main className="main">

          <div className="main-current">
            <div className="current">
              <h1>{this.state.market} Market</h1>
              <div><img width="150px" height="150px" src={"img/market/" + this.state.market + ".png"} alt=""/></div>
              <div><MarketToggle updateMarket={() => this.updateMarket()}/></div>
            </div>

            <div className="current">
              <h1>Week {this.state.week}</h1>
              <h2>Current Price Board</h2>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <th>Company</th><th>Current Price</th><th>Change</th><th>Previous Price</th>
                    </tr>
                    {currentPrices}
                  </tbody>
                </table>
              </div>
              <br/>
              <div><PriceReveal calculatePrice={() => this.calculatePrice()}/></div>
            </div>

            <div className="current">
              <h1>{this.state.dieValue1 + this.state.dieValue2}</h1>
              <div><img src={"img/dice/" + this.state.dieValue1 + ".png"} alt=""/><img src={"img/dice/" + this.state.dieValue2 + ".png"} alt=""/></div>
              <div><DiceRoll rollDice={() => this.rollDice()}/></div>
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
                      <td className="boldElement">"C City Bonds"<br/>"Yield 5%"</td>
                      <td>"PAR"</td>
                      <td>"PAR"</td>
                      <td>"PAR"</td>
                      <td>"PAR"</td>
                      <td>"PAR"</td>
                      <td>"PAR"</td>
                      <td>"PAR"</td>
                      <td>"PAR"</td>
                      <td>"PAR"</td>
                      <td>"PAR"</td>
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
