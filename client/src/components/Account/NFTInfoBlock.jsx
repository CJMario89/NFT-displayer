import './scss/NFTInfoBlock.scss'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNFTImg, getNFTOwners, selectNFTs, selectNFTsKey, selectNFTsOpen } from '../../features/NFTsSlice';
import { v4 as uuidv4 } from 'uuid';
import { getContractTokenIds } from '../../features/useWeb3';
import ContractTokenIdBlock from './ContractTokenIdBlock';
import TransactionNFTBlock from './TransactionNFTBlock';
import { alertMsg } from '../../features/MessageSlice';
import { store } from '../../app/store';
import { useMemo } from 'react';
import { useRef } from 'react';

const NFTInfoBlock = (prop) => {
    const { onNFTInfoBlockBackgroundClick } = prop;
    const dispatch = useDispatch();
    const index = useSelector(selectNFTsOpen);
    
    let NFT = store.getState().NFTs.NFTs[index];
    const NFTImgStatus = useSelector(state=>{state.NFTs.NFTs[index].imgStatus})
    const NFTMetadataStatus = useSelector(state=>{state.NFTs.NFTs[index].metadataStatus})
    const NFTOwnersStatus = useSelector(state=>state.NFTs.NFTs[index].ownersStatus);

    const [contractTokenIdBlockFlag, setContractTokenIdBlockFlag] = useState(false);
    const [transactionNFTFlag, setTransactionNFTFlag] = useState(false);
    const [contractTokenIdLoaded, setContractTokenIdLoaded] = useState(false);
    const NFTskey = useSelector(selectNFTsKey);
    
    if(NFT === undefined){
        NFT = {
            'tokenAddress': '', //string
            'tokenId': 0, //number
            'amount': 0, //number
            'blockNumber': 0, //number
            'contractType': 'ERC721',//ERC721, ERC1155
            'name': '', //string
            'symbol': '', //string
            'image': '', //blob //take from IPFS or others
            'owners': [],
            'isVideo': false, //boolean
            'tokenURI': '', //string
            'metadata': null, //metadata
            'metadataStatus': 'idle', // 'idle' | 'successed' | 'failed' | 'pending'
            'imgStatus': 'idle', // 'idle' | 'successed' | 'failed' | 'pending'
            'ownersStatus': 'idle' // 'idle' | 'successed' | 'failed' | 'pending'
        }
    }

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



const NFTImg = useMemo(()=>{
    if(index === -1){
        return '';
    }
    if(NFTMetadataStatus === 'successed'){
        if(NFT.image !== null && NFT.image !== '' && typeof NFT.image !== "undefined"){
            if(NFT.isVideo){
                return <video autoPlay='autoplay' src={NFT.image} loop={true} muted={true}></video>
            }else{
                return <img src={NFT.image} alt=""></img>
            }
        }else if(NFTImgStatus === 'failed'){
            return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-diamond-fill" viewBox="0 0 16 16">
                    <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"/>
                </svg>
        }else if(NFTImgStatus === 'pending'){
            return <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ background: 'none', display: 'block', shapeRendering: 'auto', preserveAspectRatio:"xMidYMid"}} viewBox="0 0 100 100">
                    <path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#d5d5d5" stroke="none">
                        <animateTransform attributeName="transform" type="rotate" dur="5.88235294117647s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform>
                    </path>
                </svg>
        }
    }else{
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-diamond-fill" viewBox="0 0 16 16">
                <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"/>
            </svg>
    }
}, [NFTMetadataStatus, NFTImgStatus])

    const NFTMetadataContentArray = useMemo(()=>{
        const tmpArr = [];
        if(index === -1){
            return tmpArr;
        }

        //show metadata detail
        for(const [key, value] of Object.entries(NFTDetail)){
            tmpArr.push(
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

        if(NFTMetadataStatus === 'successed'){
            if(NFT.metadata !== null && NFT.metadata !== '' && typeof NFT.metadata !== 'undefined'){
                for(const [key, value] of Object.entries(NFT.metadata)){
                    if(['signed_to', 'external_url', 'message', 'description'].includes(key)){
                        tmpArr.push(
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
                        tmpArr.push(
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
                                    tmpArr.push(
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
        
        return tmpArr;

    }, [NFTMetadataStatus])


    const NFTOwnersContentArray = useMemo(()=>{
        const tmpArr = [];
        if(index === -1){
            return tmpArr;
        } 
        if(NFTOwnersStatus === 'successed'){
            tmpArr.push(
                <div  className='NFTDetailTitle' key={uuidv4()}>
                    <span>
                        {NFT.owners.length > 1 ? "Owners" : "Owner"}
                    </span>                                       
                </div>
            )
            for(let i = 0 ; i < NFT.owners.length; i++){
                //console.log(NFT.owners[i])
                tmpArr.push(
                    <div className='NFTDetailContent' key={uuidv4()}>
                            {NFT.owners[i].owner}
                    </div>
                )
                tmpArr.push(
                    <div className='NFTDetailContent' key={uuidv4()}>
                            amount: {NFT.owners[i].amount}
                    </div>
                )
            }
        }
        return tmpArr;
    }, [NFTOwnersStatus])

    console.log("re-render")

    useEffect(()=>{
        if(index !== -1){
            dispatch(getNFTOwners({'index':index, 'key':NFTskey}));
        }

        if(NFTImgStatus === 'failed'){
            dispatch(fetchNFTImg({'index':index, 'key':NFTskey}));
        }
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
            {index === -1 || <div>
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
                        {NFTMetadataContentArray}
                        {NFTOwnersContentArray}
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
            </div>}
        </>

    )
}

export default NFTInfoBlock