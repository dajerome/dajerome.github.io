const marketCards = [
  {
    market: "Bear",
    message: "Large terminal destroyed by fire; insufficient insurance on building due to Company's delayed move to new location.",
    changes: {"Tri City Tran": -25}
  },
  {
    market: "Bull",
    message: "War scare promotes mixed activity on Wall Street.",
    changes: {"Pioneer Mult": -8, "Stryker Drlg": 8, "Uranium Ent": 5}
  },
  {
    market: "Bear",
    message: "Land rights litigation holds up progress.",
    changes: {"Stryker Drlg": -10}
  },
  {
    market: "Bull",
    message: "National firm leases Company's largest office building.",
    changes: {"Metro Prop": 5}
  },
  {
    market: "Bull",
    message: "Company lands ten-year contract with large industrial equipment corporation.",
    changes: {"Tri City Tran": 15}
  },
  {
    market: "Bull",
    message: "Influx of personnel of new company in nearby town creates a severe housing shortage.",
    changes: {"Shady Brooks": 5}
  },
  {
    market: "Bull",
    message: "Intensive advertising campaign gains Company three major, long-term contracts.",
    changes: {"Tri City Tran": 10}
  },
  {
    market: "Bear",
    message: "Company moves to a new excellent location.",
    changes: {"Tri City Tran": 5}
  },
// can not handle the $2 per share
//  {
//    market: "Bear",
//    message: "Extra year-end dividend of $2 per share declared by the Board of Directors. (Each stockholder receives $2 per share.)",
//    changes: {"Growth Corp": 10}
//  },
  {
    market: "Bull",
    message: "United Auto announces new advanced-design auto entry in the mini-car field.",
    changes: {"United Auto": 10}
  },
  {
    market: "Bear",
    message: "President, Vice-President and Chief Counsel of Growth Corporation of America reach retirement age.",
    changes: {"Growth Corp": -10}
  },
  {
    market: "Bull",
    message: "Corporation releases high profit and sales financial report and announces plans to invest an additional $2 million on special research projects next year.",
    changes: {"Growth Corp": 8}
  },
  {
    market: "Bull",
    message: "Major coal company announces reduced coal prices to electric power utilities.",
    changes: {"Valley Power": 5}
  },
  {
    market: "Bear",
    message: "Community steadily deteriorates. The management is forced to lower rental rates to attract tenants.",
    changes: {"Shady Brooks": -5}
  },
  {
    market: "Bear",
    message: "Two founders and major stockholders of the Corporation disagree on policy. One sells out his entire stockholdings.",
    changes: {"Growth Corp": -8}
  },
  {
    market: "Bear",
    message: "Urban Renewal Program delayed by indecision of City Planning Commission.",
    changes: {"Metro Prop": -10}
  },
  {
    market: "Bear",
    message: "Foreign car rage hits the buying public. Big cars in slow demand.",
    changes: {"United Auto": -15}
  },
  {
    market: "Bear",
    message: "Surge of profit-taking drops stock market.",
    changes: {"Growth Corp": -8, "Metro Prop": -5, "United Auto": -7}
  },
  {
    market: "Bull",
    message: "Corporation announces new metal forming process which it claims will revolutionize all metal-working industries covered by U.S. and foreign patents.",
    changes: {"Growth Corp": 10}
  },
  {
    market: "Bull",
    message: "Experimental nuclear power station proves more economical than anticipated. Three electrical power companies announce plans to build large-scale nuclear power plants.",
    changes: {"Uranium Ent": 10}
  },
  {
    market: "Bull",
    message: "Large petroleum corporation offers to buy all assets for cash. Offer is well above book value. Directors approve and will submit recommendation to stockholders.",
    changes: {"Stryker Drlg": 17}
  },
  {
    market: "Bear",
    message: "Company's Annual Report shows net earnings off during fourth quarter.",
    changes: {"Metro Prop": -5}
  },
  {
    market: "Bear",
    message: "Government suudenly announces it will no longer support ore prices, since it has large stockpiles.",
    changes: {"Uranium Ent": -25}
  },
  {
    market: "Bear",
    message: "Internal Revenue depletion allowance reduced 50%.",
    changes: {"Stryker Drlg": -15}
  },
  {
    market: "Bull",
    message: "Company prospectors find huge, new high-grade ore deposits.",
    changes: {"Uranium Ent": 10}
  },
  {
    market: "Bear",
    message: "President hospitalized in sanitorium for an indefinite period.",
    changes: {"Tri City Tran": -5}
  },
  {
    market: "Bull",
    message: "Buying wave raises the market.",
    changes: {"Pioneer Mult": 3, "Valley Power": 4}
  },
  {
    market: "Bull",
    message: "President announces expansion plans to increase productive capacity 30%.",
    changes: {"United Auto": 15}
  },
  {
    market: "Bull",
    message: "Commission grants permission to construct a new nuclear generating plant of great capacity and efficiency.",
    changes: {"Valley Power": 5}
  },
  {
    market: "Bull",
    message: "General market rise over the last two months.",
    changes: {"Growth Corp": 8, "Metro Prop": 5, "Pioneer Mult": 5, "United Auto": 7}
  },
  {
    market: "Bear",
    message: "Strikes halt production in all eight United Auto plants as UAW and Company officially fail to reach agreement on labor contract.",
    changes: {"United Auto": -15}
  },
  {
    market: "Bull",
    message: "Corporation unexpectedly relinquishes its monopoly on its major product after a lengthy anti-trust suit.",
    changes: {"Growth Corp": -10}
  },
  {
    market: "Bull",
    message: "Three-for-one split rumored.",
    changes: {"United Auto": 10}
  },
  {
    market: "Bear",
    message: "Public Utility Commission rejects Company's request for rate hike.",
    changes: {"Valley Power": -14}
  },
  {
    market: "Bear",
    message: "Competitor invents a new economical automatic transmission.",
    changes: {"United Auto": -5}
  },
  {
    market: "Bear",
    message: "City Council considers the Company's choicest property for large industrial fair.",
    changes: {"Metro Prop": 10}
  }
];

const marketCalculator = {
  roll2: {
    Bear: [12, 14, 13, 10, 10, 20, 21, 25, 8],
    Bull: [-2, -10, -7, -9, -2, -9, -7, -16, -4]
  },
  roll3: {
    Bear: [7, -6, 10, -10, 30, 6, -19, 22, -2],
    Bull: [26, 16, 25, 8, -14, 21, 14, -4, 17]
  },
  roll4: {
    Bear: [9, 10, 7, -5, -20, 12, 21, 18, 7],
    Bull: [18, 23, 11, 12, 46, 18, -5, 34, 15]
  },
  roll5: {
    Bear: [7, 8, 5, -6, -40, 3, 16, -14, 4],
    Bull: [23, 28, -2, 11, 56, 19, 30, 29, 14]
  },
  roll6: {
    Bear: [8, 6, 4, -4, 40, 8, 4, -12, 3],
    Bull: [20, 15, 15, 7, -20, 15, 13, -10, 12]
  },
  roll7: {
    Bear: [6, 4, 3, 3, -15, 5, 8, -8, 5],
    Bull: [17, 21, 13, -2, 37, 23, 23, 19, 14],
  },
  roll8: {
    Bear: [5, 7, -1, -3, 45, 6, -10, 10, 4],
    Bull: [19, 24, 17, 9, -5, 26, 13, -7, 15]
  },
  roll9: {
    Bear: [-2, 6, -3, -8, -20, 7, 10, 14, 6],
    Bull: [11, 18, 14, 11, 67, 15, 22, 18, 13]
  },
  roll10: {
    Bear: [11, 11, -5, -7, 30, 10, -11, -18, -4],
    Bull: [13, 31, 1, 14, -11, 18, 18, -14, 10]
  },
  roll11: {
    Bear: [-5, 13, -8, 6, 25, 4, 18, -22, -4],
    Bull: [14, -8, 19, -1, -9, 25, -10, 13, 19]
  },
  roll12: {
    Bear: [-8, -10, -10, -15, -20, -20, -23, -25, -7],
    Bull: [24, 24, 23, 20, 51, 27, 38, 33, 18]
  }
};

const companies = [
  {index: 0, shortName: "Growth Corp", fullName: "Growth Corporation of America", companyYield: "Yield 1%"},
  {index: 1, shortName: "Metro Prop", fullName: "Metro Properties, Inc.", companyYield: "No Yield"},
  {index: 2, shortName: "Pioneer Mult", fullName: "Pioneer Mutual Fund", companyYield: "Yield 4%"},
  {index: 3, shortName: "Shady Brooks", fullName: "Shady Brooks Development", companyYield: "Yield 7%"},
  {index: 4, shortName: "Stryker Drlg", fullName: "Stryker Drilling Company", companyYield: "No Yield"},
  {index: 5, shortName: "Tri City Tran", fullName: "Tri-City Transport Company", companyYield: "No Yield"},
  {index: 6, shortName: "United Auto", fullName: "United Auto Company", companyYield: "Yield 2%"},
  {index: 7, shortName: "Uranium Ent", fullName: "Uranium Enterprises, Inc.", companyYield: "Yield 6%"},
  {index: 8, shortName: "Valley Power", fullName: "Valley Power & Light Company", companyYield: "Yield 3%"},
  {index: 9, shortName: "C City Bonds", fullName: "Central City Municipal Bonds", companyYield: "Yield 5%"}
];

const companyYield = {
  "Growth Corp": 1,
  "Pioneer Mult": 4,
  "Shady Brooks": 7,
  "United Auto": 2,
  "Uranium Ent": 6,
  "Valley Power": 3
};

class StocksAndBondsLib {
  constructor () { }

  // ========================================
  getMarketCard = (index) => {
    return marketCards[index];
  }

  // ========================================
  getMarketChange = (roll, market, companyIndex) => {
    return marketCalculator["roll" + roll][market][companyIndex];
  }

  // ========================================
  getCompany = (index) => {
    return companies[index];
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
      else {
        changeStyle = {};
      }
    }
    return {changeStyle: changeStyle, changeSymbol: changeSymbol};
  }

  // ========================================
  getDividend = (company) => {
    if (company.includes("C City Bonds")) {
      return .05;
    }
    else if (companyYield.hasOwnProperty(company)) {
      return companyYield[company];
    }
    else {
      return 0;
    }
  }
}   
