import './scss/NFTBlock.scss'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNFTImg, selectNFTs, selectNFTsError } from '../../features/NFTsSlice';
import { setOpen } from '../../features/NFTsSlice';

const NFTBlock = (props) => {
    const { index } = props;
    const dispatch = useDispatch();
    const NFTs = useSelector(selectNFTs);
    const NFT = NFTs[index];

    const [NFTImg, setNFTImg] = useState(null);
    const NFTName = useRef(NFT.name);
    const NFTTokenId = useRef('#'+NFT.tokenId);
    const NFTsError = useSelector(selectNFTsError);

    useEffect(()=>{
        if(NFT.metadataStatus === 'successed' || NFT.metadataStatus === 'failed'){
            dispatch(fetchNFTImg(index));
        }
    }, [NFT.metadataStatus])


    useEffect(()=>{
        setTimeout(()=>{
            if(NFT.imgStatus === 'successed'){
                if(NFT.image !== null && NFT.image !== '' && typeof NFT.image !== "undefined"){
                    if(NFT.isVideo){
                        setNFTImg(<video autoPlay="autoplay" src={NFT.image} loop={true} muted={true}></video>)
                    }else{
                        setNFTImg(<img src={NFT.image} alt=''></img>)
                    }
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
        }, 300)
        if(NFT.imgStatus === 'failed'){
            console.log(`%c${NFTsError}`, 'color:green');
        }
    }, [NFT.imgStatus, NFTsError])


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