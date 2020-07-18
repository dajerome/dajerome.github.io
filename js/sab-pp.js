const lib = new StocksAndBondsLib();

// ========================================

function StocksAndBondsButton(props) {
  return (
    <div>
      <button className="button" onClick={() => props.f()}>{props.txt}</button>
    </div>
  );
}

// ========================================

class StocksAndBondsGamePlayerPortal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: "Enter Your Company Name",
      portfolio: {"Cash": {quantity: 5000, dividend: false}},
      phase: "Buy",
      tradeRows: [{asset: -1, price: 0, quantity: 0, total: 0}],
      tradeMessage: "",
      orderTotal: 0,
      divIntMessage: ""
    };
  }

// ========================================

  updateCompanyName(event) {
    this.setState({
      companyName: event.target.value
    });
  }

// ========================================

  updatePhase(event) {
    this.setState({
      phase: event.target.value
    });
  }

// ========================================

  updateTradeRow(event, index, property) {
    const tradeRows = this.state.tradeRows.slice();
    let tradeRow = tradeRows[index];

    tradeRow[property] = parseInt(event.target.value);
    tradeRow.total = tradeRow.price * tradeRow.quantity;
    tradeRows[index] = tradeRow;

    let orderTotal = 0;
    for (let i = 0; i < tradeRows.length; i++){
      orderTotal += tradeRows[i].total;
    }

    this.setState({
      tradeRows: tradeRows,
      orderTotal: orderTotal
    });
  }

// ========================================

  addTradeRow() {
    const tradeRows = this.state.tradeRows.slice();
    tradeRows.push({asset: -1, price: 0, quantity: 0, total: 0});
    this.setState({
      tradeRows: tradeRows
    });
  }

// ========================================

  removeTradeRow(index) {
    const tradeRows = this.state.tradeRows.slice();
    let newTradeRows = [];
    for (let i = 0; i < tradeRows.length; i++) {
      if (i == index) {
        continue;
      }
      else{
        newTradeRows.push(tradeRows[i]);
      }
    }

    let orderTotal = 0;
    for (let i = 0; i < newTradeRows.length; i++){
      orderTotal += newTradeRows[i].total;
    }

    this.setState({
      tradeRows: newTradeRows,
      orderTotal: orderTotal
    });
  }

// ========================================

  validateTrade(trade, type, portfolio) {
    let validTrade = true;
    let details = "";

    if (trade.asset == -1) {
      validTrade = false;
      details = "You must select an asset for each trade. ";
    }
    else {
      let assetName = lib.getCompany(trade.asset).shortName;
      if ((trade.quantity%10 != 0 && trade.asset != 9) || trade.quantity == 0) {
        validTrade = false;
        details = "Trade quantities for stocks must be multiples of 10 and greater than 0. (ie " + assetName + "). ";
      }
      if (trade.asset == 9 && trade.price != 1000 && trade.price != 5000 && trade.price != 10000) {
        validTrade = false;
        details = "Bonds are sold at $1,000, $5,000, & $10,000 only. (ie " + assetName + "). ";
      }

      if (type == "sell") {
        if (trade.asset == 9) {
          assetName += " " + trade.price;
        }
        if (!portfolio.hasOwnProperty(assetName)) {
          validTrade = false;
          details = "You can not sell that which you do not own. (ie " + assetName + "). ";
        }
        else {
          if (trade.quantity > portfolio[assetName].quantity) {
            validTrade = false;
            details = "You can not sell more than what you own. (ie " + assetName + "). ";
          }
        }
      }
    }
    return {validTrade: validTrade, details: details};
  }

// ========================================

  submitBuyOrder() {
    const tradeRows = this.state.tradeRows.slice();
    const portfolio = JSON.parse(JSON.stringify(this.state.portfolio));
    let cashBalance = portfolio.Cash.quantity;

    let validation = {};
    let orderValue = 0;
    for (let i = 0; i < tradeRows.length; i++) {
      let trade = tradeRows[i];
      validation = this.validateTrade(trade, "buy", portfolio);
      if (!validation.validTrade) {
        break;
      }
      else {
        orderValue += trade.total;
      }
    }

    if (orderValue > cashBalance) {
      validation = {validTrade: false, details: "Order value is greater than available cash balance. "};
    }

    if (!validation.validTrade) {
      this.setState({
        tradeMessage: "Invalid order. " + validation.details + "Fix and resubmit."
      });
      return;
    }

    else{

      for (let i = 0; i < tradeRows.length; i++) {
        let trade = tradeRows[i];
        let assetName = lib.getCompany(trade.asset).shortName;
        if (trade.asset == 9) {
          assetName += " " + trade.price;
        }

        if (portfolio.hasOwnProperty(assetName)) {
          portfolio[assetName].quantity += trade.quantity;
        }
        else {
          portfolio[assetName] = {quantity: trade.quantity, dividend: true};
        }
      }
      portfolio.Cash.quantity -= orderValue;
      this.setState({
        tradeMessage: "Trade successful!",
        tradeRows: [{asset: -1, price: 0, quantity: 0, total: 0}],
        orderTotal: 0,
        portfolio: portfolio
      });
    }
  }

// ========================================

  submitSellOrder() {
    const tradeRows = this.state.tradeRows.slice();
    const portfolio = JSON.parse(JSON.stringify(this.state.portfolio));

    let validation = {};
    for (let i = 0; i < tradeRows.length; i++) {
      let trade = tradeRows[i];
      validation = this.validateTrade(trade, "sell", portfolio);
      if (!validation.validTrade) {
        break;
      }
    }

    if (!validation.validTrade) {
      this.setState({
        tradeMessage: "Invalid order. " + validation.details + "Fix and resubmit."
      });
      return;
    }

    else{
      for (let i = 0; i < tradeRows.length; i++) {
        let trade = tradeRows[i];
        let assetName = lib.getCompany(trade.asset).shortName;
        if (trade.asset == 9) {
          assetName += " " + trade.price;
        }

        portfolio[assetName].quantity -= trade.quantity;
        portfolio.Cash.quantity += trade.total;
      }

      for (let portfolioItem in portfolio) {
        if (portfolioItem.quantity == 0) {
          delete portfolio[portfolioItem];
        }
      }

      this.setState({
        tradeMessage: "Trade successful!",
        tradeRows: [{asset: -1, price: 0, quantity: 0, total: 0}],
        orderTotal: 0,
        portfolio: portfolio
      });
    }
  }

// ========================================

  updatePortfolioRow(event, asset, property) {
    const portfolio = JSON.parse(JSON.stringify(this.state.portfolio));
    let portfolioItem = portfolio[asset];

    if (property == "dividend") {
      portfolioItem.dividend = event.target.checked;
    }

    if (property == "split") {
      portfolioItem.quantity = portfolioItem.quantity * 2;
    }

    if (property == "bankrupt") {
      portfolioItem.quantity = 0;
    }

    portfolio[asset] = portfolioItem;

    this.setState({
      portfolio: portfolio
    });
  }

// ========================================

  collectDividendsAndInterest() {
    const portfolio = JSON.parse(JSON.stringify(this.state.portfolio));
    let dividendsAndInterest = 0
    for (let company in portfolio) {
      let asset = portfolio[company];
      let multiplier = asset.quantity;
      if (company.includes("C City Bonds")) {
        multiplier = parseInt(company.split(" ")[3]) * asset.quantity;
      }
      if (asset.dividend) {
        dividendsAndInterest += lib.getDividend(company) * multiplier;
      }
    }

    portfolio.Cash.quantity += dividendsAndInterest;

    this.setState({
      portfolio: portfolio,
      divIntMessage: "Dividends & Interest collected : $" + dividendsAndInterest
    });
  }

// ========================================

  render() {

    return (
      <div className="grid-container">
        <main className="main">

          <div className="main-player">
            <div className="player">
              <input type="text" value={this.state.companyName} onChange={(event) => this.updateCompanyName(event)}/>
              <div>
                <input type="radio" name="phase" value="Buy" onChange={(event) => this.updatePhase(event)}/>Buy
                <br/>
                <input type="radio" name="phase" value="Sell" onChange={(event) => this.updatePhase(event)}/>Sell
              </div>
            </div>

            <div className="player">
              <h2>{this.state.companyName} Trade Center</h2>
              <h3>{"Current Phase : " + this.state.phase}</h3>
              <table>
                <tbody>
                  <tr>
                    <th></th><th>Asset</th><th>Quantity</th><th>Price</th><th>Total</th>
                  </tr>
                  {this.state.tradeRows.map((row, index) => (
                    <tr key={index}>
                      <td><a href="#" onClick={() => this.removeTradeRow(index)}>X</a></td>
                      <td>
                        <select type="text" value={row.asset} onChange={(event) => this.updateTradeRow(event, index, "asset")}>
                          <option value="-1"></option>
                          <option value="0">Growth Corp</option>
                          <option value="1">Metro Prop</option>
                          <option value="2">Pioneer Mult</option>
                          <option value="3">Shady Brooks</option>
                          <option value="4">Stryker Drlg</option>
                          <option value="5">Tri City Tran</option>
                          <option value="6">United Auto</option>
                          <option value="7">Uranium Ent</option>
                          <option value="8">Valley Power</option>
                          <option value="9">C City Bonds</option>
                        </select>
                      </td>
                      <td><input type="text" value={row.quantity} onChange={(event) => this.updateTradeRow(event, index, "quantity")}/></td>
                      <td><input type="text" value={row.price} onChange={(event) => this.updateTradeRow(event, index, "price")}/></td>
                      <td>{row.total}</td>
                    </tr>
                  ))}
                  <tr>
                    <td></td><td>Order Total</td><td></td><td></td><td>{this.state.orderTotal}</td>
                  </tr>
                </tbody>
              </table>
              <br/>
              <div><StocksAndBondsButton f={() => this.addTradeRow()} txt={"Add Trade"}/></div>
              <br/>
              <div>{this.state.tradeMessage}</div>
              <br/>
              <div><StocksAndBondsButton f={() => this.state.phase == "Buy" ? this.submitBuyOrder(): this.submitSellOrder()} txt={"Submit " + this.state.phase + " Order"}/></div>
            </div>

            <div className="player">
              <h2>{this.state.companyName} Portfolio</h2>
              <table>
                <tbody>
                  <tr>
                    <th>Dividends</th><th>Asset</th><th>Quantity</th><th>Split</th><th>Bankrupt</th>
                  </tr>
                  {Object.keys(this.state.portfolio).map((asset) => (
                    <tr key={asset}>
                      <td><input type="checkbox" defaultChecked={this.state.portfolio[asset].dividend} onClick={(event) => this.updatePortfolioRow(event, asset, "dividend")}/></td>
                      <td>{asset}</td>
                      <td>{this.state.portfolio[asset].quantity}</td>
                      <td><a href="#" onClick={(event) => this.updatePortfolioRow(event, asset, "split")}>{asset == "Cash" || asset.includes("C City Bonds") ? null : "Split"}</a></td>
                      <td><a href="#" onClick={(event) => this.updatePortfolioRow(event, asset, "bankrupt")}>{asset == "Cash" || asset.includes("C City Bonds") ? null : "Bankrupt"}</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br/>
              <div>{this.state.divIntMessage}</div>
              <br/>
              <div><StocksAndBondsButton f={() => this.collectDividendsAndInterest()} txt={"Collect Dividends & Interest"}/></div>
            </div>
          </div>

        </main>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<StocksAndBondsGamePlayerPortal/>, document.getElementById('root'));
