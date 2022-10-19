import './scss/NFTInfoBlock.scss'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectNFTsOpen } from '../../features/NFTsSlice';

const NFTInfoBlock = (prop) => {
    const { onNFTInfoBlockBackgroundClick } = prop;
    const dispatch = useDispatch();
    const NFT = useSelector(selectNFTsOpen);
    if(NFT === null){
        return(<></>);
    }
    const [NFTImg, setNFTImg] = useState(null);

    const [NFTDetailContent, setNFTDetailContent] = useState([]);
    const NFTDetail = {
        'Name:': NFT.name,
        'Token ID:': '#' + NFT.tokenId,
        'Symbol:': NFT.symbol,
        'Contract Type:': NFT.contractType,
        'Amount:': NFT.amount
    }



    useEffect(()=>{
        if(NFT.metadataStatus === 'successed'){
            if(NFT.image != undefined){
                if(NFT.isVideo){
                    setNFTImg(<video autoPlay='autoplay' src={NFT.image} loop={true} muted={true}></video>)
                }else{
                    setNFTImg(<img src={NFT.image} alt=""></img>)
                }
            }
        }
    }, [NFT.metadataStatus])


    useEffect(()=>{
        const NFTDetailContentArray = [] 
        for(const [key, value] of Object.entries(NFTDetail)){
            NFTDetailContentArray.push(
                <div>
                    <span>
                        {key}
                    </span>
                    <p>
                        {value}
                    </p>
                </div>
            );
        }
        setNFTDetailContent(NFTDetailContentArray);
    }, [])

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
                        <div>Refresh</div>
                    </div>
                </div>
            </div>

            <div className='NFTInfoBlockMask' onClick={()=>{onNFTInfoBlockBackgroundClick()}} onWheel={(e)=>{e.stopPropagation()}}></div>
        </>

    )
}

export default NFTInfoBlock