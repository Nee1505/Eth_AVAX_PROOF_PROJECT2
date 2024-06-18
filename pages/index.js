import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [otherBalance, setOtherBalance] = useState(undefined);


  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }



  const getOtherBalance = async (address) => {
    if (atm) {
      try {
        const balance = await atm.getBalanceOf(address);
        setOtherBalance(balance);
      } catch (err) {
        console.error("Failed to get balance", err);
        alert("Failed to get balance: " + err.message);
      }
    }
  };





  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  
      // const transfer = async (to, amount) => {
      //   if (atm) {
      //   try {
      //   const tx = await atm.transfer(to, ethers.utils.parseEther(amount.toString()), {
      //   gasLimit: 100000, // set a manual gas limit
      //   });
      //   await tx.wait();
      //   getBalance();
      //   } catch (err) {
      //   console.error("Transfer failed", err);
      //   }
      //   }
      //   };

      const transfer = async (to, amount) => {
        if (atm) {
          try {
            const tx = await atm.transfer(to, ethers.utils.parseEther(amount.toString()), {
              gasLimit: 100000 // Set a manual gas limit
            });
            await tx.wait();
            getBalance();
          } catch (err) {
            console.error("Transfer failed", err);
            alert("Transfer failed: " + err.message);
          }
        }
      };


const initUser = () => {
// Check to see if user has Metamask
if (!ethWallet) {
return <p>Please install Metamask in order to use this ATM.</p>
}


// Check to see if user is connected. If not, connect to their account
if (!account) {
  return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
}

if (balance == undefined) {
  getBalance();
}

return (
  <div>
    <p>Your Account: {account}</p>
    <p>Your Balance: {balance}</p>
    <button onClick={deposit}>Deposit 1 ETH</button>
    <button onClick={withdraw}>Withdraw 1 ETH</button>
    
    <div className="transfer-section">
          <input type="text" id="recipient" placeholder="Recipient Address" />
          <input type="number" id="amount" placeholder="Amount in ETH" step="0.01" />
          <button
            onClick={() => {
              const to = document.getElementById("recipient").value;
              const amount = parseFloat(document.getElementById("amount").value);
              if (to && amount > 0) {
                transfer(to, amount);
              } else {
                alert("Please enter a valid recipient address and amount.");
              }
            }}
          >
            Transfer ETH
          </button>
        </div>
                <div className="get-other-balance-section">
          <input type="text" id="other-address" placeholder="Enter Address" />
          <button
            onClick={() => {
              const address = document.getElementById("other-address").value;
              if (address) {
                getOtherBalance(address);
              } else {
                alert("Please enter a valid address.");
              }
            }}
          >
            Get Balance
          </button>
          {otherBalance !== undefined && (
            <p>Balance of {document.getElementById("other-address").value}: {otherBalance.toString()} ETH</p>
          )}
        </div>
</div>

)
}

useEffect(() => {getWallet();}, []);

return (
  <main className="container">
  <video autoPlay muted loop className="background-video">
    <source src="/eth-animation.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <div className="content">
      <header>
        <h1>Welcome to the Ethereum Cryptocurrency ATM!</h1>
      </header>
      {initUser()}
      </div>
      <style jsx>{`
        .container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -1;
        }
        .content {
          position: relative;
          z-index: 1;
          color:white;
          text-align: center;
          padding: 50px;
        }

        .content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 60px; /* Add spacing between elements */
        }

        header {
          margin-bottom: 60px;
        }
        .user-info {
          background: rgba(0, 0, 0, 0.7);
          padding: 30px;
          border-radius: 10px;
          display: inline-block;
        }
        .button {
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 10px 2px;
          cursor: pointer;
          border-radius: 10px;
        }
        .button:hover {
          background-color: #45a049;
        }
        .transfer-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 50px; /* Add spacing between inputs and button */
          margin-top: 20px;
        }
        input {
          margin: 5px;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
          width: 100%;
          max-width: 300px;
        }

         .get-other-balance-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px; /* Add spacing between inputs and button */
          margin-top: 20px;
        }
      `}</style>
    </main>
)
}