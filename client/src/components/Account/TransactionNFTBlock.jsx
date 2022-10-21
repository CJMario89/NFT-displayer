import './scss/TransactionNFTBlock.scss'
import React, { useRef } from 'react'
import { transferNFT } from '../../features/useWeb3'

const TransactionNFTBlock = (prop) => {
    const { onTransactionNFTBlockBackgroundClick, contractAddress, tokenId, chainId, contract_type } = prop;
    const transferTo = useRef(null);

    const requestTransferNFT = ()=>{
        try{
            transferNFT(contractAddress, tokenId, chainId, contract_type, transferTo.current.value);
        }catch(err){
            console.log(err);
        }
    }

    return (
        <>
            <div className='TransactionNFTBlock'>
                <div>Transfer NFT To</div>
                <input ref={transferTo} placeholder={"address"}></input>
                <div className='TransactionNFTButton' onClick={requestTransferNFT}>
                    Transfer
                </div>
            </div>
            <div className='TransactionNFTBlockMask' onClick={()=>{onTransactionNFTBlockBackgroundClick()}}></div>
        </>
    )
}

export default TransactionNFTBlock