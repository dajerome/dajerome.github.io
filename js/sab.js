function PriceRow(props) {
  let previousPrice = null;
  let currentPrice = null;
  let change = "-";
  let changeSymbol = "";
  let style = {};

  if (props.prices[props.week] == null) {
    previousPrice = props.prices[props.week - 2];
    currentPrice = props.prices[props.week - 1];
    if (props.week > 1) {
      change = props.prices[props.week - 1] - props.prices[props.week - 2];
    }
  }
  else {
    previousPrice = props.prices[props.week - 1];
    currentPrice = props.prices[props.week];
    if (props.week > 0) {
      change = props.prices[props.week] - props.prices[props.week -1];
    }
  }

  if (change != "-") {
    if (change < 0) {
      style = {backgroundColor: "Red", color: "White"};
    }
    else if (change > 0) {
      style = {backgroundColor: "Green", color: "White"};
      changeSymbol = "+";
    }
    else {
      style = {};
    }
  }

  return (
    <tr>
      <td className="boldElement">{props.companyName}</td>
      <td className="boldElement">{currentPrice}</td>
      <td className="boldElement" style={style}>{changeSymbol + change}</td>
      <td>{previousPrice}</td>      
    </tr>
  );
}

function HistoricalPriceRow(props) {
  return (
    <tr>
      <td className="boldElement">{props.companyName}</td>
      <td>{props.prices[1]}</td>
      <td>{props.prices[2]}</td>
      <td>{props.prices[3]}</td>
      <td>{props.prices[4]}</td>
      <td>{props.prices[5]}</td>
      <td>{props.prices[6]}</td>
      <td>{props.prices[7]}</td>
      <td>{props.prices[8]}</td>
      <td>{props.prices[9]}</td>
      <td>{props.prices[10]}</td>
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
      diceRoll1: 3,
      diceRoll2: 4,
      currentCompany: 0,
      priceLists: Array(10).fill([100].concat(Array(10).fill(null)))
    };
  }

  changeMap = {
    Bear: {
      roll2:  [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
      roll3:  [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
      roll4:  [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
      roll5:  [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
      roll6:  [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
      roll7:  [-1,-2,-3,-4,-5,-6,-7,-8,-9,-10],
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
      roll7:  [1,2,3,4,5,6,7,8,9,10],
      roll8:  [1,2,3,4,5,6,7,8,9,10],
      roll9:  [1,2,3,4,5,6,7,8,9,10],
      roll10: [1,2,3,4,5,6,7,8,9,10],
      roll11: [1,2,3,4,5,6,7,8,9,10],
      roll12: [1,2,3,4,5,6,7,8,9,10]
    }
  };

  updateMarket() {
    this.setState({market: (this.state.market == "Bull") ? "Bear" : "Bull"});
  }

  rollDice() {
    this.setState({
      diceRoll1: Math.floor(Math.random() * 6) + 1,
      diceRoll2: Math.floor(Math.random() * 6) + 1
    });
  }

  calculatePrice() {
    const currentWeek = this.state.currentCompany == 0 ? this.state.week + 1 : this.state.week;
    const totalRoll = this.state.diceRoll1 + this.state.diceRoll2;
    const priceLists = this.state.priceLists.slice();
    const companyPriceList = this.state.priceLists[this.state.currentCompany].slice();

    companyPriceList[currentWeek] = companyPriceList[currentWeek-1] + this.changeMap[this.state.market]["roll" + totalRoll][this.state.currentCompany];

    priceLists[this.state.currentCompany] = companyPriceList;

    this.setState({
      priceLists: priceLists,
      currentCompany: (this.state.currentCompany == 2) ? 0 : this.state.currentCompany + 1,
      week: currentWeek
    });
  }

  render() {
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
                    <PriceRow companyName="Company A" prices={this.state.priceLists[0]} week={this.state.week}/>
                    <PriceRow companyName="Company B" prices={this.state.priceLists[1]} week={this.state.week}/>
                    <PriceRow companyName="Company C" prices={this.state.priceLists[2]} week={this.state.week}/>
                  </tbody>
                </table>
              </div>
              <br/>
              <div><PriceReveal calculatePrice={() => this.calculatePrice()}/></div>
            </div>

            <div className="current">
              <h1>{this.state.diceRoll1 + this.state.diceRoll2}</h1>
              <div><img src={"img/dice/" + this.state.diceRoll1 + ".png"} alt=""/><img src={"img/dice/" + this.state.diceRoll2 + ".png"} alt=""/></div>
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
                    <HistoricalPriceRow companyName="Company A" prices={this.state.priceLists[0]}/>
                    <HistoricalPriceRow companyName="Company B" prices={this.state.priceLists[1]}/>
                    <HistoricalPriceRow companyName="Company C" prices={this.state.priceLists[2]}/>
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
