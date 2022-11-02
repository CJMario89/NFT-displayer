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
    const [approveContent, setApproveContent] = useState(
        <div className='TransactionNFTButton' onClick={requestApproveNFT}>
            approve
        </div>);
    const [transferContent, setTransferContent] = useState(
        <div className='TransactionNFTButton' onClick={requestTransferNFT}>
            transfer
        </div>);

    async function requestApproveNFT(){
        try{
            setApproveContent(
            <div className='TransactionNFTButton'>
                approving...
            </div>);
            await approveNFT(contractAddress, tokenId, chainId, contract_type, transferTo.current.value);
            dispatch(alertMsg("NFT approved"));
            setApproveContent(
                <div className='TransactionNFTButton'>
                    approved
                </div>);
        }catch(err){
            if(err.hasOwnProperty('message')){
                if(err.message.includes("invalid address")){
                    dispatch(alertMsg('invalid address'));
                }else if(err.message.includes("transaction underpriced")){
                    dispatch(alertMsg('Gas fee is not enough'));
                }else if(err.message.includes("approve to caller")){
                    dispatch(alertMsg('approve to caller'));
                }else if(err.message.includes("Internal JSON-RPC error.")){
                    const message = await parseError(err.message);
                    dispatch(alertMsg(message));
                }else{
                    dispatch(alertMsg(err.message));
                }
            }else{
                dispatch(alertMsg("Something when wrong!"));
            }
            setApproveContent(
                <div className='TransactionNFTButton' onClick={requestApproveNFT}>
                    approve
                </div>);
        }
    }

    async function requestTransferNFT(){
        try{
            setTransferContent(
                <div className='TransactionNFTButton'>
                    transferring...
                </div>);
            await transferNFT(contractAddress, tokenId, chainId, contract_type, transferTo.current.value);
            dispatch(alertMsg("NFT transferred"));
            setTransferContent(
                <div className='TransactionNFTButton'>
                    transferred
                </div>);
            onTransactionNFTBlockBackgroundClick();
            setRefreshSignal(true);
        }catch(err){
            if(err.hasOwnProperty('message')){
                if(err.message.includes("invalid address")){
                    dispatch(alertMsg('invalid address'));
                }else if(err.message.includes("transaction underpriced")){
                    dispatch(alertMsg('Gas fee is not enough'));
                }else if(err.message.includes("transfer of token that is not own")){
                    dispatch(alertMsg("don't own this token"));
                }else if(err.message.includes("Internal JSON-RPC error.")){
                    const message = await parseError(err.message);
                    dispatch(alertMsg(message));
                }else{
                    dispatch(alertMsg(err.message));
                }
            }else{
                dispatch(alertMsg("Something when wrong!"));
            }
            setTransferContent(
                <div className='TransactionNFTButton' onClick={requestTransferNFT}>
                    transfer
                </div>);
        }
    }


    const parseError = async(err)=>{
        const errorJsonString = err.replace("Internal JSON-RPC error.", "");
        const errJson = await JSON.parse(errorJsonString);
        if(errJson.hasOwnProperty("message")){
            return errJson.message;
        }else{
            return errJson;
        }
    }

    return (
        <>
            <div className='TransactionNFTBlock'>
                <div>Transfer NFT To</div>
                <input ref={transferTo} placeholder={"address"}></input>
                    {approveContent}
                
                    {transferContent}
                    
            </div>
            <div className='TransactionNFTBlockMask' onClick={()=>{onTransactionNFTBlockBackgroundClick()}}></div>
        </>
    )
}

export default TransactionNFTBlock