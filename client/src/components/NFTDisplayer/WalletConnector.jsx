import './scss/WalletConnector.scss';
import React, { useEffect, useRef } from 'react';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import MetamaskSVG from '../../assets/images/metamask.svg'
import CoinbaseSVG from '../../assets/images/coinbase.svg'
import WalletConnectSVG from '../../assets/images/walletconnect.svg'

const WalletConnector = (prop) => {
    const { onWalletBackgroundClick } = prop;
    const MetamaskIcon = useRef(null);
    const CoinbaseIcon = useRef(null);
    const WalletConnectIcon = useRef(null);
    let web3, account;

    

    const JSONRPC_URL = `https://hardworking-divine-ensemble.bsc.discover.quiknode.pro/43958efedb5ffdfbb03ed542992a33da7b09a51f/`;
    const CHAIN_ID = 56;

    const connectMetaMask = async()=>{
        try{
            const provider = window.ethereum.providers.find((provider) => provider.isMetaMask);
            web3 = new Web3(provider);
            var accounts = await provider.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: web3.utils.toHex(56) }]
            });
            walletListener(provider, account);
        }catch(e){
            throw e;
        }
    }


    const connectWalletConnect = async()=>{
        const provider = new WalletConnectProvider({
            rpc: {
                 56: `https://hardworking-divine-ensemble.bsc.discover.quiknode.pro/43958efedb5ffdfbb03ed542992a33da7b09a51f/`
            },
            chainId: CHAIN_ID
        });
        try{
            await provider.enable();
            web3 = new Web3(provider);
            var accounts = await web3.eth.getAccounts();
            account = accounts[0];
            walletListener(provider, account);
        }catch(e){
            throw e;
        }
    }

    const connectCoinbase = async()=>{
        const client = new CoinbaseWalletSDK({
            appName: 'NFT-displayer',
            appLogoUrl: '',
            darkMode: false
        });
        const provider = client.makeWeb3Provider(
            JSONRPC_URL,
            CHAIN_ID
        );
        try{
            web3 = new Web3(provider);
            var accounts = await provider.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            walletListener(provider, account);
            // walletListener(window.ethereum, account);
        }catch(e){
            console.log(e);
        }
    }

    const mobileConnect = ()=>{
        if(window.ethereum != undefined){
            connectMetamask();
        }else{
            connectWalletConnect();
        }
    }


    const walletListener = (provider, account)=>{
        provider.on("accountsChanged", async function(accounts){
            account = accounts[0];
            console.log("changed:"+account)
        });
        console.log(account)
        onWalletBackgroundClick();
    }



    useEffect(()=>{
        MetamaskIcon.current.src = MetamaskSVG;
        CoinbaseIcon.current.src = CoinbaseSVG;
        WalletConnectIcon.current.src = WalletConnectSVG;
    }, []);

    return (
        <>
            <div className="walletContainer">
                <div className='WCtitle'>
                    Choose a provider to connect wallet
                </div>
                <div className="wallet" onClick={connectMetaMask}>
                    <div className="walletIcon">
                        <img ref={MetamaskIcon} className="MetamaskIcon" alt=''></img>
                    </div>
                    <span>
                        Metamask
                    </span>
                </div>
                <div className="wallet" onClick={connectCoinbase}>
                    <div className="walletIcon">
                        <img ref={CoinbaseIcon} className="CoinbaseIcon" alt=''></img>
                    </div>
                    <span>
                        Coinbase
                    </span>
                </div>
                <div className="wallet" onClick={connectWalletConnect}>
                    <div className="walletIcon">
                        <img ref={WalletConnectIcon} className="WalletConnectIcon" alt=''></img>
                    </div>
                    <span>
                        WalletConnect
                    </span>
                </div>
            </div>
            <div className='walletBackground' onClick={onWalletBackgroundClick}></div>
        </>
    )
}

export default WalletConnector