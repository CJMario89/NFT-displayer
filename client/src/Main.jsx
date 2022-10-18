import './scss/Main.scss'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectWalletStatus } from './features/WalletSlice';
import WalletConnectorButton from './components/Connector/WalletConnectorButton';
import WalletAccount from './components/Account/WalletAccount';

const Main = () => {
    const [walletConnected, setWalletConnected] = useState(true);

    const walletStatus = useSelector(selectWalletStatus);

    

    useEffect(()=>{
        setWalletConnected(()=>(walletStatus === 'unconnected' ? true : false));

    }, [walletStatus])
    return (
        <div className="main">
            


            {walletConnected && <WalletConnectorButton/>}
            
            {!walletConnected && <WalletAccount/>}
        </div>
    )
}

export default Main