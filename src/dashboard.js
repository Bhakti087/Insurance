import { useEffect,useState } from "react";
import { ethers } from "ethers";
import Axios from "axios";


export default function Dashboard() {
    const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [listOfCoins, setListOfCoins] = useState([]);
    const [searchWord, setSearchWord] = useState("");

    useEffect(() => {
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

        Axios.get("https://api.coinstats.app/public/v1/coins?skip=0").then(
        (response) => {
            setListOfCoins(response.data.coins);
            
        }
        );
    }, [])
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
    const filteredCoins = listOfCoins.filter((coin) => {
        return coin.name.toLowerCase().includes("filecoin".toLowerCase());
    });
    console.log(filteredCoins)
    return(
        <div className="h-screen w-screen">
            <div className=" overflow-hidden h-[100px] flex justify-between items-center py-[15px] px-2 md:px-10">
                <img className="w-[250px] h-[60px] mr-9 object-fill" src="/logo.png" alt="Crytosurance-logo" />
                <button className="text-cyan-500 py-1 sm:px-6 border-2 border-cyan-500 rounded-xl font-extrabold transition-all duration-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:border-[#1e1e1e] sm:py-2">CLAIM</button>
            </div>
            <div>
                <h1 className="text-xl font-bold text-white">Account: {defaultAccount}</h1>
                <h2 className="text-xl font-bold text-white">Amount: {userBalance}</h2>
                <h2 className="text-xl font-bold text-white">FileCoin Price: {filteredCoins[0]?.price} $</h2>
            </div>
        </div>
    )
}