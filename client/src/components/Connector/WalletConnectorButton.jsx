import React, { useEffect, useState } from 'react'
import WalletConnector from './WalletConnector';
import './scss/walletConnectorButton.scss'
import Logo3D from '../Logo/Logo3D';

const WalletConnectorButton = (prop) => {
    const { autoConnect } = prop;
    const [walletBlockShowingFlag, setWalletBlockShowingFlag] = useState(()=>{
        const flag = autoConnect !== null ? true : false;
        if(flag){
            return autoConnect.account !== 'null' ? true : false;
        }
        return flag;
    });
    const walletBlockClass = walletBlockShowingFlag ? 'walletBlock walletBlockFadeIn' : 'walletBlock'
    const [connectWalletClass, setConnectWalletClass] = useState('connectWallet')
    
    useEffect(()=>{
        setConnectWalletClass('connectWallet connectWalletFadeIn');
        setWalletBlockShowingFlag(()=>{
            const flag = autoConnect !== null ? true : false;
            if(flag){
                return autoConnect.account !== 'null' ? true : false;
            }
            return flag;
        });
    }, [autoConnect])

    return (
        <>
            <Logo3D/>
            <div className='logo3D'></div>
            <div className={connectWalletClass} onClick={()=>setWalletBlockShowingFlag(prev=>!prev)}>
                Connect Wallet
            </div>
            {walletBlockShowingFlag && <WalletConnector onWalletBackgroundClick={()=>setWalletBlockShowingFlag(prev=>!prev)} autoConnect={autoConnect} walletBlockClass={walletBlockClass}/>}
        </>
    )
}

export default WalletConnectorButton