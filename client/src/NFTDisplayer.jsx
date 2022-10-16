import './scss/NFTDisplayer.scss'
import React, { useState } from 'react'
import WalletConnector from './components/NFTDisplayer/WalletConnector'

const NFTDisplayer = () => {
    const [walletconnectShowingFlag, setWalletConnectorShowingFlag] = useState(false);
    return (
        <div className="NFTDisplayer">
            <span className='title'>
                NFT Displayer
            </span>


            <div className='connectWallet' onClick={()=>setWalletConnectorShowingFlag(prev=>!prev)}>
                Connect Wallet
            </div>
            {walletconnectShowingFlag && <WalletConnector onWalletBackgroundClick={()=>setWalletConnectorShowingFlag(prev=>!prev)}/>}
        </div>
    )
}

export default NFTDisplayer