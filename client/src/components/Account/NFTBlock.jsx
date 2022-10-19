import './scss/NFTBlock.scss'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOpenSeaImg, selectNFTs } from '../../features/NFTsSlice';
import { setOpen } from '../../features/NFTsSlice';

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
                if(NFT.image != undefined){
                    if(NFT.isVideo){
                        setNFTImg(<video autoPlay='autoplay' src={NFT.image} loop={true} muted={true}></video>)
                    }else{
                        setNFTImg(<img src={NFT.image} alt=""></img>)
                    }
                }
            }else{
                //dispatch(fetchOpenSeaImg(index));

            }
        }, 300)
    }, [NFT.metadataStatus])

    useEffect(()=>{
        setTimeout(()=>{
            if(NFT.openseaImgStatus === 'successed'){
                if(NFT.image != undefined){
                    if(NFT.isVideo){
                        setNFTImg(<video autoplay="autoplay" src={NFT.image} loop="true" muted="true"></video>)
                    }else{
                        setNFTImg(<img src={NFT.image}></img>)
                    }
                }
            }
        }, 300)
    }, [NFT.openseaImgStatus])


    // console.log("re-render")

    return (
        <div className='NFTBlock' onClick={()=>{dispatch(setOpen(index))}}>
            <div className='NFTContainer'>
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
        </div>
    )
}

export default memo(NFTBlock)