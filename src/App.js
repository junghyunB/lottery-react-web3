import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import Web3 from "web3";

let lotteryAddress = "0x856E27313E5D272B3dbf051dF4D59818c804DCaD";
let lotteryABI =  [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "BET", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "DRAW", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "FAIL", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "REFUND", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "WIN", "type": "event" }, { "inputs": [], "name": "answerForTest", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address payable", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "betAndDistribute", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "stateMutability": "payable", "type": "function", "payable": true }, { "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "bet", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "stateMutability": "payable", "type": "function", "payable": true }, { "inputs": [], "name": "getPot", "outputs": [ { "internalType": "uint256", "name": "pot", "type": "uint256" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "distribute", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "setAnswerForTest", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "isMatch", "outputs": [ { "internalType": "enum Lottery.BettingResult", "name": "", "type": "uint8" } ], "stateMutability": "pure", "type": "function", "constant": true }, { "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "getBetInfo", "outputs": [ { "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" }, { "internalType": "address", "name": "bettor", "type": "address" }, { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "stateMutability": "view", "type": "function", "constant": true } ]


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      betRecords: [],
      winRecords: [],
      failRecords: [],
      pot: '0',
      challenges: ['A', 'B'],
      finalRecords: [{
        bettor:'0xabcd...',
        index:'0',
        challenges:'ab',
        answer:'ab',
        targetBlockNumber:'10',
        pot:'0'
      }]
    }
  }

  async componentDidMount() {
    await this.initWeb3()
    await this.getBetEvents();
  }

  initWeb3 = async () => {
    if (window.ethereum) {
      console.log('Recent mode')
      this.web3 = new Web3(window.ethereum);
      try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          // Acccounts now exposed
          // this.web3.eth.sendTransaction({/* ... */});
      } catch (error) {
          // User denied account access...
          console.log(`User denied account access error : ${error}`)
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      console.log('legacy mode')
      this.web3 = new Web3(Web3.currentProvider);
      // Acccounts always exposed
      // web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    let accounts = await this.web3.eth.getAccounts();
    this.accounts = accounts[0];

    this.lotteryContract = new this.web3.eth.Contract(lotteryABI, lotteryAddress);
    
    // let pot = await this.lotteryContract.methods.getPot().call()
    // console.log(pot)

    // let owner = await this.lotteryContract.methods.owner().call()
    // console.log(owner)
  }

  getBetEvents = async() => {
    const records = [];
    let events = await this.lotteryContract.getPastEvents("BET", {fromBlock:0, toBlock:"latest"});
    console.log(events)
  }


  // 배팅하는 함수
  bet = async() => {
    let nonce = await this.web3.eth.getTransactionCount(this.account);
    await this.lotteryContract.methods.betAndDistribute('0xcd').send({from:this.accounts, value:5000000000000000, gas:300000})
  }

  // 팟머니 송출, 배팅할 글자 선택 ui(버튼 형식)
  // 배팅 결정 버튼

  //히스토리 테이블 : index, address, challenge, answer, pot, status, AnswerBlockNumber 

getCard = (_Character, _cardStyle) => {
  let _card = '';
  if(_Character === "A") {
    _card = '🂡'
  }

  if(_Character === "B") {
    _card = '🂱'
  }

  if(_Character === "C") {
    _card = '🃁'
  }

  if(_Character === "D") {
    _card = '🃑'
  }

  return(
    <button className={_cardStyle}>
    <div className='card-body text-center'>
      <p className='card-text'></p>
      <p className='card-text text-center' style={{fontSize:200}}>{_card}</p>
      <p className='card-text'></p>
    </div>
  </button>
  )
}

render() {
  return (
    // Header - Pot, Betting characters
    <div className="App">
      <div className="container">
        <div className='jumbotron'>
          <h1>Current Pot : {this.state.pot} </h1>
          <p>Lottery</p>
          <p>Lottery tutorial</p>
          <p>Your Bet</p>
          <p>{this.state.challenges[0]} {this.state.challenges[1]}</p>
        </div>
      </div>

      {/* Card section */}
      <div className='container'>
        <div className='card-group'>
          {this.getCard("A", "card bg-primary")}
          {this.getCard("B", "card bg-warning")}
          {this.getCard("C", "card bg-danger")}
          {this.getCard("D", "card bg-success")}
        </div>
      </div>
      
      <br />
      <div className='container'>
        <button className="btn btn-danger btn-lg">BET!</button>
      </div>

    <br />
      <div className='container'>
        <table className='table table-dark table-striped'>
          <thead>
            <tr>
              <th>Index</th>
              <th>Address</th>
              <th>Challenge</th>
              <th>Answer</th>
              <th>Pot</th>
              <th>Statue</th>
              <th>AnswerBlockNumber</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.finalRecords.map((record, index) => {
                return(
                  <tr key={index}>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
    );
  }
}

export default App;
