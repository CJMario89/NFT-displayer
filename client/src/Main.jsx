import './scss/Main.scss'
import React, { useEffect, useState } from 'react'
import WalletConnector from './components/Connector/WalletConnector'
import { useDispatch, useSelector } from 'react-redux';
import { removeWallet, selectWallet, selectWalletStatus } from './features/WalletSlice';
import WalletConnectorButton from './components/Connector/WalletConnectorButton';

const NFTDisplayer = () => {
    const [walletConnected, setWalletConnected] = useState(true);

    const walletStatus = useSelector(selectWalletStatus);
    const dispatch = useDispatch();

    const disconnectWallet = ()=>{
        dispatch(removeWallet());
        window.localStorage.clear();
    }

    useEffect(()=>{
        setWalletConnected(()=>(walletStatus === 'unconnected' ? true : false));

    }, [walletStatus])
    return (
        <div className="main">
            <span className='title'>
                NFT Displayer
            </span>


            {walletConnected && <WalletConnectorButton/>}
            
            {!walletConnected && <div className='disconnectWallet' onClick={disconnectWallet}>disconnectWallet</div>}
        </div>
    )
}

export default NFTDisplayer