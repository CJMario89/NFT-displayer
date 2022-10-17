import './scss/WalletConnector.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';


import MetamaskSVG from '../../assets/images/metamask.svg'
import CoinbaseSVG from '../../assets/images/coinbase.svg'
import WalletConnectSVG from '../../assets/images/walletconnect.svg'
import { selectWallet, selectWalletStatus, setupWallet } from '../../features/WalletSlice';


const WalletConnector = (prop) => {
    const { onWalletBackgroundClick } = prop;
    const MetamaskIcon = useRef(null);
    const CoinbaseIcon = useRef(null);
    const WalletConnectIcon = useRef(null);

    const [walletHint, setWalletHint] = useState(false);
    const walletHintImg = useRef(null);

    const wallet = useSelector(selectWallet);
    const walletStatus = useSelector(selectWalletStatus);
    const dispatch = useDispatch();

    const JSONRPC_URL = `https://mainnet.infura.io/v3/4442b8b396684ed2a3e98f9e1772cdb0`;
    const CHAIN_ID = 1;

    let MetamaskExtension = false;
    if(window.ethereum !== undefined){
        MetamaskExtension = window.ethereum.isMetaMask;
    }

    const connectMetamask = async()=>{

        if(!MetamaskExtension){
            setWalletHint(true);
            return;
        }

        try{
            const provider = (window.ethereum.providers === undefined ? window.ethereum : window.ethereum.providers.find((provider) => provider.isMetaMask));
            const web3 = new Web3(provider);

            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: web3.utils.toHex(1) }]
            });
            const account = accounts[0];

            walletListener(provider, "MetaMask", account);
        }catch(e){
            throw e;
        }
    }

    const connectWalletConnect = async()=>{
        if(walletHint !== false){
            setWalletHint(false);
        }
        const provider = new WalletConnectProvider({
            rpc: {
                1: `https://mainnet.infura.io/v3/4442b8b396684ed2a3e98f9e1772cdb0`,
                56: `https://hardworking-divine-ensemble.bsc.discover.quiknode.pro/43958efedb5ffdfbb03ed542992a33da7b09a51f/`
            },
            chainId: CHAIN_ID
        });
        try{
            await provider.enable();
            const web3 = new Web3(provider);
            var accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            walletListener(provider, "WalletConnect", account);
        }catch(e){
            throw e;
        }
    }

    const connectCoinbase = async()=>{
        if(walletHint !== false){
            setWalletHint(false);
        }
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
            const web3 = new Web3(provider);
            var accounts = await provider.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            walletListener(provider, "Coinbase", account);
            // walletListener(window.ethereum, account);
        }catch(e){
            console.log(e);
        }
        console.log(window.ethereum)
    }
    const mobileConnect = ()=>{
        if(window.ethereum != undefined){
            connectMetamask();
        }else{
            connectWalletConnect();
        }
    }


    const walletListener = (provider, providerName, account)=>{
        provider.on("accountsChanged", async function(accounts){
            account = accounts[0];
            console.log("changed:"+account)
        });
        dispatch(setupWallet({
            address: account,
            providerName: providerName,
            chain_id: CHAIN_ID
        }))

        console.log(account)
        onWalletBackgroundClick();
    }

    
    useEffect(()=>{
        MetamaskIcon.current.src = MetamaskSVG;
        CoinbaseIcon.current.src = CoinbaseSVG;
        WalletConnectIcon.current.src = WalletConnectSVG;
    }, []);

    useEffect(()=>{
        if(walletHint !== false){
            walletHintImg.current.src = MetamaskSVG;
        }   
    }, [walletHint])

    return (
        <>
            <div className='walletBlock'>
                <div className="walletContainer">
                    <div className='WBtitle'>
                        Providers
                    </div>
                    <div className="wallet" onClick={connectMetamask}>
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
                {walletHint && <div className='walletHint'>
                    <div className='WBtitle'>
                        Metamask is not installed
                    </div>
                    <img className='walletHintImg' ref={walletHintImg} alt=""></img>
                    <div className='walletHintButton' onClick={()=>{window.open('https://metamask.io/', '_blank');}}>
                        go to install
                    </div>
                    <div className='walletHintButton' onClick={connectWalletConnect}>
                        connect mobile with QRcode
                    </div>
                </div> }
            </div>
            <div className='walletBackground' onClick={onWalletBackgroundClick}></div>
        </>
    )
}

export default WalletConnector