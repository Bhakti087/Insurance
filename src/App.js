import { useState } from "react";
import { ethers } from "ethers";
import Dashboard from "./dashboard";
import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom";

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			console.log('MetaMask Here!');

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
				getAccountBalance(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());
	}

	const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};

	const chainChangedHandler = () => {
		window.location.reload();
	}

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={defaultAccount ? <Dashboard /> :
              <div className="h-screen w-screen">
                <div className=" overflow-hidden h-[100px] flex justify-between items-center py-[15px] px-2 md:px-10">
                    <img className="w-[250px] h-[60px] mr-9 object-fill" src="/logo.png" alt="Crytosurance-logo" />
                    <button onClick={connectWalletHandler} className="text-cyan-500 py-1 sm:px-6 border-2 border-cyan-500 rounded-xl font-extrabold transition-all duration-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:border-[#1e1e1e] sm:py-2">CONNECT WALLET</button>
                </div>
                <div className="mx-auto my-auto flex h-auto max-w-screen-md items-center justify-center">
                    <div className="h-auto my-6 mx-4 w-full rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 p-1">
                        <div className="flex flex-col px-5 w-full bg-gray-800 back">
                            <h1 className="font-extrabold text-2xl py-5 text-transparent md:text-4xl bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Make Insurance Fair and Accessible</h1>
                            <p className="bg-gray-800 px-6 text-xl font-bold text-[#A3B3BC] my-6">Decentralized insurance protocol to collectively build insurance products.</p>
                            <div className="cursor-pointer mt-[2vh] flex justufy-center items-center bg-gray-800 px-10">
                                <img className="h-[30px] mr-4 bg-gray-800" src="/discord.png" alt="discord-icon" />
                                <p className="bg-gray-800 text-[#a3b3bc]">Join Our Discord {defaultAccount} {userBalance}</p>
                            </div>
                              <button onClick={connectWalletHandler} className="text-cyan-500 mb-[4vh] mt-[10vh] py-2 sm:px-6 border-2 border-cyan-500 rounded-xl font-extrabold transition-all duration-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:border-[#1e1e1e]">CONNECT WALLET</button>
                              <div className="flex justufy-center text-center items-center text-red-500 bg-gray-800 p-2">
                                  {errorMessage}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          }/>
          <Route exact path="/dashboard" element={!defaultAccount ? <Navigate to="/" /> : <Dashboard />}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
