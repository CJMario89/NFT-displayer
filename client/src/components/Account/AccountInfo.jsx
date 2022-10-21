import './scss/AccountInfo.scss'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectWallet } from '../../features/WalletSlice'
import { v4 as uuidv4 } from 'uuid'

const AccountInfo = () => {
    const wallet = useSelector(selectWallet);
    

    let token = 'ETH';
    let chain = 'Ethereun Mainnet';
    if(wallet.chain_id === 1){
        chain = 'Ethereun Mainnet';
        token = 'ETH';
    }else if(wallet.chain_id === 56){
        chain = 'Binance Smart Chain';
        token = 'BNB';
    }else if(wallet.chain_id === 137){
        chain = 'Polygon Mainnet';
        token = 'MATIC';
    }

    const accountInfo = {
        'chain:': chain,
        'provider:': wallet.providerName,
        'balance:': wallet.balance + ` ${token}`
    }

    const accountInfoJSX = [];
    for(const [key, value] of Object.entries(accountInfo)) {
        accountInfoJSX.push(
            <div className='accountInfoContainer' key={uuidv4()}>
                <div className='accountInfoTitle'>
                    {key}
                </div>
                <div className='accountInfoContent'>
                    {value}
                </div>
            </div>
        )
    }
    

    return (
        <>
            <div className='accountInfo'>
                {accountInfoJSX}
            </div>
        </>
    )
}

export default AccountInfo