const lib = new StocksAndBondsLib();

// ========================================

function StocksAndBondsTradeCenter(props) {
  const companyName = props.state.companyName;
  const order = props.state.order;
  const trades = order.trades;
  const companyList = props.state.setup.companyList;

  const companyOptions = [<option key="optionDefault" value=""></option>];
  for (let i = 0; i < companyList.length; i++) {
    companyOptions.push((
      <option key={"option"+companyList[i]} value={companyList[i]}>{companyList[i]}</option>
    ));
  }

  const tradeRows = [];
  for (let i = 0; i < trades.length; i++) {
    const trade = trades[i];
    tradeRows.push((
      <tr key={"trade"+i}>
        <td><a href="#!" onClick={() => props.removeTrade(i)}>X</a></td>
        <td>
          <select type="text" value={trade.asset} onChange={(event) => props.updateTrade(event, i, "asset")}>
            {companyOptions}
          </select>
        </td>
        <td>
          <select type="text" value={trade.type} onChange={(event) => props.updateTrade(event, i, "type")}>
            <option value=""></option>
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </td>
        <td><input type="text" value={trade.quantity} onChange={(event) => props.updateTrade(event, i, "quantity")}/></td>
        <td><input type="text" value={trade.price} onChange={(event) => props.updateTrade(event, i, "price")}/></td>
        <td>{trade.total}</td>
      </tr>
    ));
  }

  return (
    <div className="player">
      <h2>{companyName} Trade Center</h2>
      <table>
        <tbody>
          <tr>
            <th></th><th>Asset</th><th>Type</th><th>Quantity</th><th>Price</th><th>Total</th>
          </tr>
          {tradeRows}
          <tr style={{borderTop: "2px solid black"}}>
            <td></td><td>Buy Total</td><td></td><td></td><td></td><td>{order.buyTotal}</td>
          </tr>
          <tr>
            <td></td><td>Sell Total</td><td></td><td></td><td></td><td>{order.sellTotal}</td>
          </tr>
          <tr style={{borderTop: "2px solid black"}}>
            <td></td><td>Total to Cash</td><td></td><td></td><td></td><td>{order.sellTotal - order.buyTotal}</td>
          </tr>
        </tbody>
      </table>
      <br/>
      <div>{lib.StocksAndBondsButton(() => props.addTrade(), "Add Trade")}</div>
      <br/>
      <div>{order.message}</div>
      <br/>
      <div>{lib.StocksAndBondsButton(() => props.submitOrder(), "Submit Order")}</div>
    </div>
  );
}

// ========================================

function StocksAndBondsPortfolio(props) {
  const companyName = props.state.companyName;
  const portfolio = props.state.portfolio;

  const portfolioRows = [];
  for (let asset in portfolio) {
    portfolioRows.push((
      <tr key={"portfolio"+asset}>
        <td><input type="checkbox" defaultChecked={portfolio[asset].dividend} onClick={(event) => props.update(event, asset, "dividend")}/></td>
        <td>{asset}</td>
        <td>{portfolio[asset].quantity}</td>
        <td><a href="#!" onClick={(event) => props.update(event, asset, "split")}>{!lib.isCompanyPriced(asset) ? null : "Split"}</a></td>
        <td><a href="#!" onClick={(event) => props.update(event, asset, "bankrupt")}>{!lib.isCompanyPriced(asset) ? null : "Bankrupt"}</a></td>
      </tr>
    ));
  }

  return (
    <div className="player">
      <h2>{companyName} Portfolio</h2>
      <h4>Your current assets have the potential to yield {"$" + props.state.portfolioYieldPotential} in dividends & interest</h4>
      <br/>
      <table>
        <tbody>
          <tr>
            <th>Dividends</th><th>Asset</th><th>Quantity</th><th>Split</th><th>Bankrupt</th>
          </tr>
          {portfolioRows}
        </tbody>
      </table>
      <br/>
      <div>{props.state.yieldMessage}</div>
      <br/>
      <div>{lib.StocksAndBondsButton(() => props.collect(), "Collect Dividends & Interest")}</div>
    </div>
  );
}

// ========================================

class StocksAndBondsPlayerPortal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setup: {},
      companyName: "Enter Your Company Name",
      order: {
        trades: [{asset: "", type: "", price: 0, quantity: 0, total: 0}],
        message: "",
        buyTotal: 0,
        sellTotal: 0
      },
      portfolio: {"Cash": {quantity: 5000, dividend: false}},
      portfolioYieldPotential: 0,
      yieldMessage: ""
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
    const url = "http://www.squishyproductions.com/";
    const dataToFetch = ["companies"];
    for (let i = 0; i < dataToFetch.length; i++){
      const data = await lib.getData("http://localhost:8000/" + "stocks_and_bonds/data/" + dataToFetch[i] + ".json");
      setup[dataToFetch[i]] = data;
    }
    lib.initCompanyLists(setup);
    const companyList = lib.getAllCompanies();
    setup.companyList = companyList;
    this.setState({setup});
  }

// ========================================

  updateCompanyName(event) {
    this.setState({
      companyName: event.target.value
    });
  }

// ========================================

  getOrderTotals(trades) {
    let buyTotal = 0;
    let sellTotal = 0;
    for (let i = 0; i < trades.length; i++){
      buyTotal += trades[i].type == "Buy" ? trades[i].total : 0;
      sellTotal += trades[i].type == "Sell" ? trades[i].total : 0;
    }
    return {buyTotal, sellTotal};
  }

// ========================================

  addTradeRow() {
    const order = JSON.parse(JSON.stringify(this.state.order));
    const trades = order.trades.slice();
    trades.push({asset: "", price: 0, quantity: 0, total: 0});

    order.trades = trades;
    this.setState({order});
  }

// ========================================

  removeTradeRow(index) {
    const order = JSON.parse(JSON.stringify(this.state.order));
    const trades = order.trades.slice();
    trades.splice(index, 1);

    const {buyTotal, sellTotal} = this.getOrderTotals(trades);

    order.trades = trades;
    order.buyTotal = buyTotal;
    order.sellTotal = sellTotal;
    this.setState({order});
  }

// ========================================

  updateTradeRow(event, index, property) {
    const order = JSON.parse(JSON.stringify(this.state.order));
    const trades = order.trades.slice();
    const trade = trades[index];

    if (property == "asset" || property == "type") {
      trade[property] = event.target.value;
    }
    else {
      trade[property] = event.target.value ? parseInt(event.target.value) : 0;
    }

    trade.total = trade.price * trade.quantity;
    trades[index] = trade;

    const {buyTotal, sellTotal} = this.getOrderTotals(trades);

    order.trades = trades;
    order.buyTotal = buyTotal;
    order.sellTotal = sellTotal;
    this.setState({order});
  }

// ========================================

  submitOrder() {
    const portfolio = JSON.parse(JSON.stringify(this.state.portfolio));
    const order = JSON.parse(JSON.stringify(this.state.order));
    const trades = order.trades.slice();

    if ((order.sellTotal - order.buyTotal) > portfolio.Cash.quantity) {
      order.message = "Invalid order. Order value is greater than available cash balance. Fix and resubmit.";
      this.setState({order});
      return;
    }

    let validation = {};
    for (let i = 0; i < trades.length; i++) {
      const trade = trades[i];
      validation = this.validateTrade(trade, portfolio);
      if (!validation.validTrade) {
        break;
      }
    }

    if (!validation.validTrade) {
      order.message = "Invalid order. " + validation.details + "Fix and resubmit.";
      this.setState({order});
      return;
    }
    else {
      for (let i = 0; i < trades.length; i++) {
        const trade = trades[i];
        let assetName = trade.asset;
        if (!lib.isCompanyPriced(assetName)) {
          assetName += " " + trade.price;
        }

        if (trade.type == "Buy") {
          if (portfolio.hasOwnProperty(assetName)) {
            portfolio[assetName].quantity += trade.quantity;
          }
          else {
            portfolio[assetName] = {quantity: trade.quantity, dividend: true};
          }
        }
        else {
          portfolio[assetName].quantity -= trade.quantity;
        }
      }
    }

    for (let asset in portfolio) {
      if (portfolio[asset].quantity == 0 && asset != "Cash") {
        delete portfolio[asset];
      }
    }

    portfolio.Cash.quantity -= order.buyTotal;
    portfolio.Cash.quantity += order.sellTotal;

    const portfolioYieldPotential = this.getPortfolioYieldPotential(portfolio);

    order.trades = [{asset: "", type: "", price: 0, quantity: 0, total: 0}];
    order.message = "Trade successful!";
    order.buyTotal = 0;
    order.sellTotal = 0;
    this.setState({order, portfolio, portfolioYieldPotential, yieldMessage: ""});
  }

// ========================================

  validateTrade(trade, portfolio) {
    let validTrade = true;
    let details = "";

    if (trade.asset == "") {
      validTrade = false;
      details = "You must select an asset for each trade. ";
    }
    else if (trade.type == "") {
      validTrade = false;
      details = "You must indicate each trade as a buy or a sell. ";
    }
    else {
      let assetName = trade.asset;
      if ((trade.quantity%10 != 0 && lib.isCompanyPriced(assetName)) || trade.quantity == 0) {
        validTrade = false;
        details = "Trade quantities for stocks must be multiples of 10 and greater than 0. (ie " + assetName + "). ";
      }
      if (!lib.isCompanyPriced(assetName) && trade.price != 1000 && trade.price != 5000 && trade.price != 10000) {
        validTrade = false;
        details = "Bonds are sold at $1,000, $5,000, & $10,000 only. (ie " + assetName + "). ";
      }

      if (trade.type == "Sell") {
        if (!lib.isCompanyPriced(assetName)) {
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
    return {validTrade, details};
  }

// ========================================

  updatePortfolioRow(event, asset, property) {
    const portfolio = JSON.parse(JSON.stringify(this.state.portfolio));
    const portfolioAsset = portfolio[asset];

    let portfolioYieldPotential = this.state.portfolioYieldPotential;
    if (property == "dividend") {
      portfolioAsset.dividend = event.target.checked;
      portfolioYieldPotential = this.getPortfolioYieldPotential(portfolio);
    }

    if (property == "split") {
      portfolioAsset.quantity = portfolioAsset.quantity * 2;
    }

    if (property == "bankrupt") {
      portfolioAsset.quantity = 0;
    }

    portfolio[asset] = portfolioAsset;
    this.setState({portfolio, portfolioYieldPotential});
  }

// ========================================

  getPortfolioYieldPotential(portfolio) {

    let portfolioYieldPotential = 0;
    for (let asset in portfolio) {
      if (portfolio[asset].dividend) {
        portfolioYieldPotential += portfolio[asset].quantity * lib.getDividend(asset);
      }
    }
    return portfolioYieldPotential;
  }

// ========================================

  collectDividendsAndInterest() {
    const portfolio = JSON.parse(JSON.stringify(this.state.portfolio));
    const portfolioYield = this.state.portfolioYieldPotential;

    portfolio.Cash.quantity += portfolioYield;

    this.setState({
      portfolio,
      yieldMessage: "Dividends & Interest collected : $" + portfolioYield
    });
  }

// ========================================

  render() {
    if (this.state.setup.companyList) {

      return (
        <div className="grid-container">
          <main className="main">

            <div className="main-player">
              <div className="player">
                <input type="text" value={this.state.companyName} onChange={(event) => this.updateCompanyName(event)}/>
              </div>

              <StocksAndBondsTradeCenter
                state={this.state}
                addTrade={() => this.addTradeRow()}
                removeTrade={(index) => this.removeTradeRow(index)}
                updateTrade={(event, index, property) => this.updateTradeRow(event, index, property)}
                submitOrder={() => this.submitOrder()}
              />

              <StocksAndBondsPortfolio
                state={this.state}
                collect={() => this.collectDividendsAndInterest()}
                update={(event, asset, property) => this.updatePortfolioRow(event, asset, property)}
              />
            </div>

          </main>
        </div>
      );
    }

    return <p>Loading...</p>
  }
}

// ========================================

ReactDOM.render(<StocksAndBondsPlayerPortal/>, document.getElementById('root'));
