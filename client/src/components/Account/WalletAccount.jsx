import './scss/WalletAccount.scss'
import React, { useState } from 'react'
import AccountInfo from './AccountInfo'
import NFTCollection from './NFTCollection'
import { useDispatch, useSelector } from 'react-redux'
import { removeWallet, selectWallet } from '../../features/WalletSlice'

const WalletAccount = () => {
    const [page, setPage] = useState('accountInfo');
    const accountInfoClassName = 'walletAccountOption accountInfoOption ' + (page === 'accountInfo' ? 'walletAccountFocus': '');
    const NFTCollectionClassName = 'walletAccountOption NFTCollectionOption ' + (page === 'NFT-collection' ? 'walletAccountFocus': '');

    const wallet = useSelector(selectWallet);
    const dispatch = useDispatch();

    const disconnectWallet = ()=>{
        dispatch(removeWallet());
        window.localStorage.clear();
    }



    return (
        <>
            <div className='navbar'>
                <div className='walletAccountAddress'>
                    {wallet.address}
                    <div className='disconnectWallet' onClick={disconnectWallet}>
                        Disconnect&nbsp;
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
                    </div>
                </div>
                <div className='walletAccountNavbar'>
                    <div className={accountInfoClassName} onClick={()=>{setPage('accountInfo')}}>Account Info</div>
                    <div className={NFTCollectionClassName} onClick={()=>{setPage('NFT-collection')}}>NFT collection</div>
                </div>
            </div>
            
            
            {page === 'accountInfo' && <AccountInfo/>}
            {page === 'NFT-collection' && <NFTCollection/>}
        </>
    )
}

export default WalletAccount