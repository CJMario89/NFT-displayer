import React, { useState } from 'react'
import WalletConnector from './WalletConnector';
import './scss/walletConnectorButton.scss'

const WalletConnectorButton = () => {
    const [walletBlockShowingFlag, setWalletBlockShowingFlag] = useState(false);

    return (
        <>
           <div className='connectWallet' onClick={()=>setWalletBlockShowingFlag(prev=>!prev)}>
                Connect Wallet
            </div>
            {walletBlockShowingFlag && <WalletConnector onWalletBackgroundClick={()=>setWalletBlockShowingFlag(prev=>!prev)}/>}
        </>
    )
}

export default WalletConnectorButton