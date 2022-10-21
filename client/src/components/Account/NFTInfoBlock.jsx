import './scss/NFTInfoBlock.scss'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNFTImg, getNFTOwners, selectNFTs, selectNFTsOpen } from '../../features/NFTsSlice';
import { v4 as uuidv4 } from 'uuid';
import { getContractTokenIds } from '../../features/useWeb3';
import ContractTokenIdBlock from './ContractTokenIdBlock';
import TransactionNFTBlock from './TransactionNFTBlock';
import { alertMsg } from '../../features/MessageSlice';

const NFTInfoBlock = (prop) => {
    const { onNFTInfoBlockBackgroundClick } = prop;
    const dispatch = useDispatch();
    const index = useSelector(selectNFTsOpen);
    if(index === -1){
        return(<></>);
    }
    const NFT = useSelector(selectNFTs)[index];
    const [NFTImg, setNFTImg] = useState(null);

    const [contractTokenIdBlockFlag, setContractTokenIdBlockFlag] = useState(false);
    const [transactionNFTFlag, setTransactionNFTFlag] = useState(false);
    const [contractTokenIdLoaded, setContractTokenIdLoaded] = useState(false);
    transactionNFTFlag

    const [NFTDetailContent, setNFTDetailContent] = useState([]);
    const NFTDetail = {
        'token address:': NFT.tokenAddress,
        'chain:': NFT.chain,
        'name:': NFT.name,
        'token ID:': '#' + NFT.tokenId,
        'symbol:': NFT.symbol,
        'contract type:': NFT.contractType,
        'amount:': NFT.amount
    }



    useEffect(()=>{
        if(NFT.metadataStatus === 'successed'){
            if(NFT.image !== null && NFT.image !== '' && typeof NFT.image !== "undefined"){
                if(NFT.isVideo){
                    setNFTImg(<video autoPlay='autoplay' src={NFT.image} loop={true} muted={true}></video>)
                }else{
                    setNFTImg(<img src={NFT.image} alt=""></img>)
                }
            }else if(NFT.imgStatus === 'failed'){
                setNFTImg(
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-diamond-fill" viewBox="0 0 16 16">
                        <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"/>
                    </svg>
                )
            }else if(NFT.imgStatus === 'pending'){
                setNFTImg(
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{margin: 'auto', background: 'none', display: 'block', shapeRendering: 'auto', width:"200px", height:"200px", preserveAspectRatio:"xMidYMid"}} viewBox="0 0 100 100">
                        <path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#d5d5d5" stroke="none">
                            <animateTransform attributeName="transform" type="rotate" dur="5.88235294117647s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform>
                        </path>
                    </svg>
                )
            }
        }else{
            setNFTImg(
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-diamond-fill" viewBox="0 0 16 16">
                    <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"/>
                </svg>
            )
        }
    }, [NFT.metadataStatus, NFT.imgStatus])

    useEffect(()=>{
        if(NFT.imgStatus === 'failed'){
            dispatch(fetchNFTImg(index));
        }



        //show metadata detail
        const NFTDetailContentArray = [] 
        for(const [key, value] of Object.entries(NFTDetail)){
            NFTDetailContentArray.push(
                <div key={uuidv4()}>
                    <span>
                        {key}
                    </span>
                    {key === 'token address:' ? 
                        <p onClick={()=>{showContractTokenIds(value)}} className='token_address'>
                            {value}
                        </p>
                        :
                        <p>
                            {value}
                        </p>
                    }
                </div>
            );
        }

        if(NFT.metadataStatus === 'successed'){
            if(NFT.metadata !== null && NFT.metadata !== '' && typeof NFT.metadata !== 'undefined'){
                for(const [key, value] of Object.entries(NFT.metadata)){
                    if(['signed_to', 'external_url', 'message', 'description'].includes(key)){
                        NFTDetailContentArray.push(
                            <div key={uuidv4()}>
                                <span>
                                    {key}:
                                </span>
                                <p>
                                    {value}
                                </p>
                            </div>
                        );
                    }else if(key === 'attributes'){
                        NFTDetailContentArray.push(
                            <div className='NFTDetailTitle' key={uuidv4()}>
                                <span>
                                    Attributes
                                </span>                                       
                            </div>
                        )
                        for(let i = 0; i < value.length; i++){
                            let attributesKey;
                            let attributesValue;
                            for(const [k, v] of Object.entries(value[i])){
                                if(k === 'trait_type'){
                                    attributesKey = v;
                                }
                                if(k === 'value'){
                                    attributesValue = v;
                                    NFTDetailContentArray.push(
                                        <div key={uuidv4()}>
                                            <span>
                                                {attributesKey}:
                                            </span>
                                            <p>
                                                {attributesValue}
                                            </p>
                                        </div>
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }
        if(NFT.ownersStatus === 'successed'){
            NFTDetailContentArray.push(
                <div  className='NFTDetailTitle' key={uuidv4()}>
                    <span>
                        {NFT.owners.length > 1 ? "Owners" : "Owner"}
                    </span>                                       
                </div>
            )
            for(let i = 0 ; i < NFT.owners.length; i++){
                console.log(NFT.owners[i])
                NFTDetailContentArray.push(
                    <div className='NFTDetailContent' key={uuidv4()}>
                            {NFT.owners[i].owner}
                    </div>
                )
                NFTDetailContentArray.push(
                    <div className='NFTDetailContent' key={uuidv4()}>
                            amount: {NFT.owners[i].amount}
                    </div>
                )
            }
        }
        setNFTDetailContent(NFTDetailContentArray);

    }, [NFT.metadataStatus, NFT.ownersStatus])



    useEffect(()=>{
        dispatch(getNFTOwners(index));
    }, [])

    async function showContractTokenIds(value){
        const empty = [];
        window.contract_token_ids = empty;
        setContractTokenIdBlockFlag(true);
        if(NFT.chain !== 'eth'){
            return;
        }
        await getContractTokenIds(value, NFT.chain, NFT.contractType);
        if(window.binarySearchTimes < 30){
            setContractTokenIdLoaded(true);
            dispatch(alertMsg('Finished'));
        }else{
            dispatch(alertMsg('Token Ids too many to handle'));
        }
    }

    return (
        <>
            <div className='NFTInfoBlock'>
                <div className='NFTInfoImgContainer'>
                    <div className='NFTInfoImg'>
                        {NFTImg}
                    </div>
                    <div className='NFTInfoName'>
                        {NFT.name}
                    </div>
                    <div className='NFTInfoTokenId'>
                        #{NFT.tokenId}
                    </div>
                </div>
                <div className='NFTInfoContainer'>
                    <div className='NFTInfoDetailContainer'>
                        {NFTDetailContent}
                    </div>
                    
                    <div className='NFTInfoController'>
                        <div onClick={()=>{onNFTInfoBlockBackgroundClick()}}>Close</div>
                        <div onClick={()=>{setTransactionNFTFlag(true)}}>Transfer</div>
                    </div>
                </div>
            </div>
            <div className='NFTInfoBlockMask' onClick={()=>{onNFTInfoBlockBackgroundClick()}} onWheel={(e)=>{e.stopPropagation()}}></div>

            {contractTokenIdBlockFlag  && <ContractTokenIdBlock onContractTokenIdBlockBackgroundClick={()=>{setContractTokenIdBlockFlag(false)}} loaded={contractTokenIdLoaded} chain={NFT.chain}/>}
            {transactionNFTFlag  && <TransactionNFTBlock onTransactionNFTBlockBackgroundClick={()=>{setTransactionNFTFlag(false)}} contractAddress={NFT.tokenAddress} tokenId={NFT.tokenId} chainId={NFT.chainId} contract_type={NFT.contractType}/>}
        </>

    )
}

export default NFTInfoBlock