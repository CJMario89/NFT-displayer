import './scss/TransactionNFTBlock.scss'
import React, { useRef, useState } from 'react'
import { approveNFT, transferNFT } from '../../features/useWeb3'
import { alertMsg } from '../../features/MessageSlice';
import { useDispatch } from 'react-redux';
import { setRefreshSignal } from '../../features/NFTsSlice';

const TransactionNFTBlock = (prop) => {
    const { onTransactionNFTBlockBackgroundClick, contractAddress, tokenId, chainId, contract_type } = prop;
    const transferTo = useRef(null);
    const dispatch = useDispatch();
    const [approveContent, setApproveContent] = useState('approve');
    const [transferContent, setTransferContent] = useState('transfer');

    const requestApproveNFT = async()=>{
        try{
            setApproveContent("approving...");
            await approveNFT(contractAddress, tokenId, chainId, contract_type, transferTo.current.value);
            dispatch(alertMsg("NFT approved"));
            setApproveContent("approved");
        }catch(err){
            if(err.hasOwnProperty('message')){
                if(err.message.includes("invalid address")){
                    dispatch(alertMsg('invalid address'));
                }else if(err.message.includes("transaction underpriced")){
                    dispatch(alertMsg('Gas fee is not enough'));
                }else if(err.message.includes("approve to caller")){
                    dispatch(alertMsg('approve to caller'));
                }else{
                    dispatch(alertMsg(err.message));
                }
            }else{
                dispatch(alertMsg("Something when wrong!"));
            }
            setApproveContent("approve");
        }
    }

    const requestTransferNFT = async ()=>{
        try{
            setTransferContent('transferring...');
            await transferNFT(contractAddress, tokenId, chainId, contract_type, transferTo.current.value);
            dispatch(alertMsg("NFT transferred"));
            setTransferContent('transferred');
            onTransactionNFTBlockBackgroundClick();
            setRefreshSignal(true);
        }catch(err){
            if(err.hasOwnProperty('message')){
                if(err.message.includes("invalid address")){
                    dispatch(alertMsg('invalid address'));
                }else{
                    if(err.message.includes("invalid address")){
                        dispatch(alertMsg(err.message.message));
                    }else if(err.includes('transaction underpriced')){
                        dispatch(alertMsg('Gas fee is not enough'));
                    }
                    dispatch(alertMsg(err.message));
                }
            }else{
                dispatch(alertMsg("Something when wrong!"));
            }
            setTransferContent('transfer');
        }
    }

    return (
        <>
            <div className='TransactionNFTBlock'>
                <div>Transfer NFT To</div>
                <input ref={transferTo} placeholder={"address"}></input>
                <div className='TransactionNFTButton' onClick={requestApproveNFT}>
                    {approveContent}
                </div>
                <div className='TransactionNFTButton' onClick={requestTransferNFT}>
                    {transferContent}
                </div>
            </div>
            <div className='TransactionNFTBlockMask' onClick={()=>{onTransactionNFTBlockBackgroundClick()}}></div>
        </>
    )
}

export default TransactionNFTBlock