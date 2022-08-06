import './App.css';
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useEffect, useState } from 'react';
import stakerABI from "./stakerABI.json";
import Countdown from "react-countdown";



const providerOptions = {
  /* See Provider Options Section */
};


//let provider;
let signer;
const stakAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";


function App() {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [provider, setProvider] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  let [stakedAmount, setStakedAmount] = useState(0);
  const [stakingContract, setStakingContract] = useState(null);
  const [timeBeforeLock, setTimeBeforeLock] = useState(0);
  useEffect(() => {

    // const a = async () => {
    //   if (stakingContract) {
    //     const data = await stakingContract.balanceOf();
    //   }

    // }
    //setStakedBalance(ethers.utils.formatEther(a))
    //console.log(provider);
    checkBalance()
    TimeLeft()

  }, [stakedBalance, stakingContract]);

  async function stakeEth() {
    try {
      console.log("in the stake eth function!");

      var alif = ethers.utils.parseUnits(document.getElementById("myText").value, 18);

      console.log("alif is ", alif);

      const abc = provider.getSigner();

      await stakingContract.stake({ from: abc.address, value: alif, gasLimit: 100000 });

      console.log("sucessful");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      checkBalance();
    } catch (e) {
      console.log(e);
    }

  }

  async function checkBalance() {
    if (stakingContract) {
      const a = await stakingContract.balanceOf();

      setStakedBalance(ethers.utils.formatEther(a))
      console.log("if ballancces")
    }


    console.log("checkBalance")
  }



  async function Unstake() {
    if (stakingContract) {
      await stakingContract.withdraw({ gasLimit: 100000 })
      await new Promise((resolve) => setTimeout(resolve, 10000));
      const a = await stakingContract.balanceOf();
      setStakedBalance(ethers.utils.formatEther(a))
    }


    console.log("checkBalance")
  }
  async function TimeLeft() {
    if (stakingContract) {
      const a = await stakingContract.timeLeft()
      setTimeBeforeLock(a)
      console.log("timelock console", parseInt(a.toString()))

      // let unix_timestamp = 1549312452
      // // Create a new JavaScript Date object based on the timestamp
      // // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      var date = new Date(parseInt(a.toString()) * 1000);
      // // Hours part from the timestamp
      // var hours = date.getHours();
      // // Minutes part from the timestamp
      // var minutes = "0" + date.getMinutes();
      // // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();
      console.log("in seconds", seconds);

      // // Will display time in 10:30:23 format
      // var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

      // console.log(formattedTime);








    }


    console.log("in the timelock function")
  }





  async function connetWallet() {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions // required
      });

      const instance = await web3Modal.connect();
      console.log(instance, "instace");


      setProvider(new ethers.providers.Web3Provider(instance));
      console.log(provider, "provideeeerrr");

      signer = provider.getSigner();
      var signerAddress = await signer.getAddress();
      console.log(provider);
      if (provider) {
        setWeb3Provider(provider);
      }
      setStakingContract(new ethers.Contract(stakAddr, stakerABI, signer));
      checkBalance();

      //setStakedAmount(await stakingContract.balanceOf());

    } catch (error) {
      console.log(error);
    }
  }



  const Completionist = () => <span>Staking Period Over</span>;

  return (
    <div className="App">
      <h1>Staking App</h1>
      {
        web3Provider == null ? (
          <div>
            <button onClick={connetWallet}> Connet Wallet</button>
          </div>
        ) : (
          <div>
            <p>Wallet Connected!</p>
            <p>{web3Provider.provider.selectedAddress}</p>
          </div>
        )
      }
      <Countdown date={Date.now() + timeBeforeLock}>
        <Completionist />
      </Countdown><br></br>
      <label>Enter amount to stake:
        <input
          type="number"
          id="myText"
        // onChange={(e) => setStakedAmount(e.target.value)}
        />
      </label>
      <button onClick={() => stakeEth()} />
      <button onClick={() => Unstake()} />
      <p>Staked {stakedBalance} eth</p>



    </div>
  );
}

export default App;
