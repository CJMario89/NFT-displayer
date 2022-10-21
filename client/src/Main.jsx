import './scss/Main.scss'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectWalletStatus } from './features/WalletSlice';
import WalletConnectorButton from './components/Connector/WalletConnectorButton';
import WalletAccount from './components/Account/WalletAccount';
import AlertMsg from './components/Message/AlertMsg';


const Main = () => {
    const [walletConnected, setWalletConnected] = useState(false);
    const [autoConnect, setAutoConnect] = useState(null);

    const walletStatus = useSelector(selectWalletStatus);
    const dispatch = useDispatch();
    // console.log(walletConnected)

    useEffect(()=>{
        console.log(walletStatus)
        const wallet_address = localStorage.getItem('wallet_address')
        const providerName = localStorage.getItem('providerName')
        
        if(wallet_address !== null && providerName !== null  && walletStatus === 'unconnected'){
            setAutoConnect({
                account: localStorage.getItem('wallet_address'),
                providerName: localStorage.getItem('providerName')
            });
        }
        setWalletConnected(()=>(walletStatus === 'unconnected' ? false : true));

    }, [walletStatus])

    return (
        <div className="main">
            <AlertMsg/>


            {!walletConnected && <WalletConnectorButton autoConnect={autoConnect}/>}
            
            {walletConnected && <WalletAccount/>}
        </div>
    )
}

export default Main