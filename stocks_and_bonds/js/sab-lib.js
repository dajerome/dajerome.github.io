class StocksAndBondsLib {

  constructor () {}

// ========================================

  init = (data) => {
    this.marketCards = data.marketCards.marketCards;
    this.marketCalculator = data.marketCalculator;

    this.initCompanyLists(data);
  }

// ========================================

  initCompanyLists = (data) => {
    this.companies = data.companies;

    this.allCompanies = [];
    this.pricedCompanies = [];
    for (let companyKey in this.companies) {
      this.allCompanies.push(companyKey);
      if (this.companies[companyKey].priced) {
        this.pricedCompanies.push(companyKey);
      }
    }
  }

// ========================================

  getInitialPrices = () => {
    if (this.pricedCompanies.length > 0) {
      const currentPrices = {};
      let selected = true;

      for (let i = 0; i < this.pricedCompanies.length; i++) {
        currentPrices[this.pricedCompanies[i]] = {
          price: 100,
          change: "-",
          marketChange: "-",
          previousPrice: null,
          split: false,
          dividends: true,
          selected: selected
        };
        selected = false;
      }
      return currentPrices;
    }
    return null;
  }

// ========================================

  getInitialHistories = () => {
    if (this.allCompanies.length > 0) {
      const histories = {};
      for (let i = 0; i < this.allCompanies.length; i++) {
        histories[this.allCompanies[i]] = [];
      }
      return histories;
    }
    return null;
  }

// ========================================

  getAllCompanies = () => {
    return this.allCompanies;
  }

// ========================================

  getFirstCompany = () => {
    return this.pricedCompanies[0];
  }

// ========================================

  isFirstCompany = (companyKey) => {
    return this.pricedCompanies.indexOf(companyKey) == 0;
  }

// ========================================

  getNextCompany = (companyKey) => {
    return this.pricedCompanies[this.pricedCompanies.indexOf(companyKey) == this.pricedCompanies.length - 1 ? 0 : this.pricedCompanies.indexOf(companyKey) + 1];
  }

// ========================================

  isCompanyPriced = (companyKey) => {
    return this.pricedCompanies.includes(companyKey);
  }

// ========================================
  getDividend = (assetName) => {
    if (!this.isCompanyPriced(assetName)) {
      const price = assetName.match(/\d+$/)[0];
      const companyKey = assetName.split(price)[0].trim();
      return (this.companies[companyKey].yield * price) / 100;
    }
    else{
      return this.companies[assetName].yield ? this.companies[assetName].yield : 0;
    }
  }

// ========================================

  getMarketCard = (index) => {
    return this.marketCards[index];
  }

// ========================================

  getMarketChange = (roll, market, companyKey) => {
    return this.marketCalculator["roll" + roll][market][this.companies[companyKey].marketCalculatorIndex];
  }

// ========================================

  getYieldString = (yieldValue) => {
    if (yieldValue) {
      return "Yield " + yieldValue + "%";
    }
    return "No Yield";
  }

// ========================================

  getChangeStyle = (change) => {
    let changeStyle = {};
    let changeSymbol = "";

    if (change != "-") {
      if (change < 0) {
        changeStyle = {backgroundColor: "Red", color: "White"};
      }
      else if (change > 0) {
        changeStyle = {backgroundColor: "Green", color: "White"};
        changeSymbol = "+";
      }
    }
    return {changeStyle, changeSymbol};
  }

// ========================================

  StocksAndBondsButton = (f, txt) => {
    return (
      <div>
        <button className="button" onClick={() => f()}>{txt}</button>
      </div>
    );
  }

// ========================================

  getData = async (url) => {
    const response = await fetch(url);
    return await response.json();
  }
}
