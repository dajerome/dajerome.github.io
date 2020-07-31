const lib = new StocksAndBondsLib();

// ========================================

class StocksAndBondsCompanyList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      setup: {}
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
      const data = await lib.getData(url + "stocks_and_bonds/data/" + dataToFetch[i] + ".json");
      setup[dataToFetch[i]] = data;
    }
    this.setState({setup});
  }

// ========================================

  render() {
    if (this.state.setup.companies) {

      const companyList = [];
      for (let companyKey in this.state.setup.companies) {
        const company = this.state.setup.companies[companyKey];
        companyList.push((
          <tr key={companyKey}>
            <td>{company.fullName}</td>
            <td>{lib.getYieldString(company.yield)}</td>
            <td style={{textAlign: "left"}}>{company.description}</td>
          </tr>
        ));
      }

      return (
        <table style={{width: "80%"}}>
          <tbody>
            <tr>
              <th style={{width: "20%"}}>Company</th><th style={{width: "10%"}}>Yield</th><th style={{width: "70%"}}>Description</th>
            </tr>
            {companyList}
          </tbody>
        </table>
      );
    }

    return <p>Loading...</p>
  }

}

// ========================================

ReactDOM.render(<StocksAndBondsCompanyList/>, document.getElementById('root'));
