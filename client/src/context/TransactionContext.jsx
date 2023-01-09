import React, { useState, useEffect } from 'react';
import { Contract, ethers } from 'ethers';
import { contractABI, contractAddress } from '../components/utils/constants';

export const TransactionsContext = React.createContext();

const { ethereum } = window;


const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const TransactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    return TransactionsContract;
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({ address: '', amount: '', keyword: '', message: '' });
    const [isLoading,setIsLoading]=useState(false);
    const [transactionCount,setTransactionCount]=useState(localStorage.getItem('transactionCount'));
    const handleChange = (e, name) => {
        setFormData((prevState) => ({
            ...prevState, [name]: e.target.value
        }))
    }
    const checkIfWalletIsConnected = async () => {
        try {

            if (!ethereum) { return console.log("Please Install metmask"); }
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log("no account found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object");
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) { return console.log("Please Install metmask"); }
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);

        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object");
        }
    }

    const sendTransactions = async () => {
        try {
            if (!ethereum) { return console.log("Please Install metmask"); }
            const { addressTo, amount, keyword, message } = formData;
           const TransactionsContract= getEthereumContract();
            const parsedAmount=ethers.utils.parseEther(amount);

           await ethereum.request({
            method:"eth_sendTransactions",
            params:[{
                form:currentAccount,
                to:addressTo,
                gas:'0.000021',
                value:parsedAmount,
            }]
           });


          const transactionsHash=await TransactionsContract.addToBlockchain(addressTo,parsedAmount,message,keyword);
          setIsLoading(true);
          console.log(`Loading - ${transactionsHash.hash}`);
          await transactionsHash.wait();
          setIsLoading(false);
          console.log(`Success - ${transactionsHash.hash}`);
          const transactionCount=await TransactionsContract.getTransactions();
          setTransactionCount(transactionCount.toNumber());
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);
    return (
        <TransactionsContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransactions }}>
            {children}
        </TransactionsContext.Provider>
    )
}