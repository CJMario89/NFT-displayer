import './scss/NFTBlock.scss'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectNFTs } from '../../features/NFTsSlice';

const NFTBlock = (props) => {
    const { index } = props;
    const dispatch = useDispatch();
    const NFTs = useSelector(selectNFTs);
    const NFT = NFTs[index];

    const [NFTImg, setNFTImg] = useState(null);
    const NFTName = useRef(NFT.name);
    const NFTTokenId = useRef('#'+NFT.tokenId);

    useEffect(()=>{
        setTimeout(()=>{
            if(NFT.metadataStatus === 'successed'){
                if(NFT.isVideo){
                    setNFTImg(<video src={NFT.image}></video>)
                }else{
                    setNFTImg(<img src={NFT.image}></img>)
                }
            }
        }, 300)
    }, [NFT])
    return (
        <div className='NFTBlock'>
            <div className='NFTImgContainer'>
                {NFTImg}
            </div>
            <div className='NFTName'>
                {NFTName.current}
            </div>
            <div className='NFTTokenId'>
                {NFTTokenId.current}
            </div>
        </div>
    )
}

export default memo(NFTBlock)