import './App.css';
import { useState, useEffect } from "react";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import {loadContract} from "./utils/load-contract"


function App() {

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  const [account, setAccount] = useState("not connected");
  const [bal, setBalance] = useState("not connected");
  const[fundBal , setFundingBalance] = useState(null);
  const[reload,shouldReload] = useState(false);

  const reloadEffect =() => {
    shouldReload(!reload);
  }

  useEffect(() => {

    const loadProvider = async()=>{
    // this returns the provider, or null if it wasn't detected
    const provider = await detectEthereumProvider();

    const contract = await loadContract("Funder",provider);

    if (provider) {
      provider.request({ method: "eth_requestAccounts" });
      setWeb3Api({
        web3: new Web3(provider),
        provider,
        contract,
      });
    } else {
      alert("Please install MetaMask!");
    }
     
    
    
  }

  loadProvider();
  }, []);


  useEffect(() => {
    const loadBalance = async() =>{
      const { contract,web3} = web3Api ;
      const conBalance = await web3.eth.getBalance(contract.address);
      setFundingBalance(web3.utils.fromWei(conBalance,"ether"))
            
    }

    web3Api.contract && loadBalance();
    
  },[web3Api,reload])


  const connectMetamask = async (e) => {
    e.preventDefault();

    if (typeof window.ethereum !== "undefined") {

      let web3 = new Web3(Web3.givenProvider)
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      const balance = await web3.eth.getBalance(accounts[0]).then((res) => web3.utils.fromWei(res, "ether") + " ETH");
      setBalance(balance);
      document.getElementById("metamaskCon").innerText = "Connected ✔";

      window.ethereum.on('accountsChanged', async (acc) => {
        setAccount(acc[0]);
        const balance = await web3.eth.getBalance(acc[0]).then((res) => web3.utils.fromWei(res, "ether") + " ETH");
        setBalance(balance);
      })
    } else {
      alert("First Install metamask wallet!")
    }


  }


  const transferFund = async() => {
    const {web3,contract} = web3Api;
    await  contract.transfer({
       from: account,
       value: web3.utils.toWei("2","ether"),
    });

    reloadEffect();
  }

  const withdrawFund = async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmout = web3.utils.toWei("2", "ether");
    await contract.withdraw(withdrawAmout, {
      from: account,
    });

    reloadEffect();
  };

  return (
    <div className="App">
      {/* AppName */}
      <div className="title">
        Funding Blockchain Web
      </div>

      {/* Transaction details */}

      <div className="box">
        <div className="balance">
          Funding Balance : {fundBal} ETH
        </div>
        <div className="account">
          Account : {account}
          <br />
        </div>
        <div className="AccountBalance">
          Your Account Balance : {bal}
        </div>
        <div className="btn">
          <button id='metamaskCon' className="metaMask" onClick={connectMetamask}>
            Connect to metamask <img className='metaImg' src='https://cdn.iconscout.com/icon/free/png-512/metamask-2728406-2261817.png' alt="...">
            </img>
          </button>
          <button className="Transfer" onClick={transferFund}>
            Transfer
          </button>
          <button className="Withdraw" onClick={withdrawFund}>
            Withdraw
          </button>
        </div>
      </div>

    </div>

  );
}

export default App;
