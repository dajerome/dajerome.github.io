const companyCount = 3;

const companyMap = {
  "Company A": 0,
  "Company B": 1,
  "Company C": 2
}

const changeMap = {
  Bear: {
    roll2:  [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
    roll3:  [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
    roll4:  [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
    roll5:  [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
    roll6:  [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
    roll7:  [-15,-2,-3,-4,-5,-6,-7,-8,-9,-10],
    roll8:  [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
    roll9:  [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
    roll10: [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
    roll11: [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
    roll12: [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10]
  },
  Bull: {
    roll2:  [1,2,3,4,5,6,7,8,9,10],
    roll3:  [1,2,3,4,5,6,7,8,9,10],
    roll4:  [1,2,3,4,5,6,7,8,9,10],
    roll5:  [1,2,3,4,5,6,7,8,9,10],
    roll6:  [1,2,3,4,5,6,7,8,9,10],
    roll7:  [10,2,3,4,5,6,7,8,9,10],
    roll8:  [1,2,3,4,5,6,7,8,9,10],
    roll9:  [1,2,3,4,5,6,7,8,9,10],
    roll10: [1,2,3,4,5,6,7,8,9,10],
    roll11: [1,2,3,4,5,6,7,8,9,10],
    roll12: [1,2,3,4,5,6,7,8,9,10]
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
