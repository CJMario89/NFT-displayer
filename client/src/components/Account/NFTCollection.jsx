import './scss/NFTCollection.scss'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addDisplayedPage, clearDisplayedPage, fetchNFTMetadata, getNFTs, selectMetadataStatus, selectNFTs, selectNFTsCursor, selectNFTsDisplayedPage, selectNFTsError, selectNFTsFetchedChain, selectNFTsStatus, selectNFTsTotal, selectSortNFTsByTime } from '../../features/NFTsSlice';
import { selectWallet } from '../../features/WalletSlice';
import NFTBlock from './NFTBlock';
import NFTInfoBlock from './NFTInfoBlock';
import { v4 as uuidv4 } from 'uuid';



const NFTCollection = () => {
    const NFTsPerPage = 25;
    const dispatch = useDispatch();
    const NFTs = useSelector(selectNFTs);
    const NFTsTotal = useSelector(selectNFTsTotal);
    const NFTsDisplayedPage = useSelector(selectNFTsDisplayedPage);
    const NFTsCursor = useSelector(selectNFTsCursor);
    const NFTsFetchedChain = useSelector(selectNFTsFetchedChain);
    const NFTsStatus = useSelector(selectNFTsStatus);
    const NFTsMetadataStatus = useSelector(selectMetadataStatus);
    const NFTsError = useSelector(selectNFTsError);

    const wallet = useSelector(selectWallet);

    const displayedNFTsAmount = NFTsDisplayedPage * NFTsPerPage > NFTsTotal ? NFTsTotal : NFTsDisplayedPage * NFTsPerPage;
    const remainNFTsAmount = NFTsTotal - displayedNFTsAmount;


    const NFTOpened = false;


    useEffect(()=>{
        if(NFTsFetchedChain < 3){
            dispatch(getNFTs(wallet.address));
        }else{
            
            displayNextPageNFT();
        }
    }, [NFTsCursor, NFTsFetchedChain])




    useEffect(()=>{
        if(NFTsStatus === 'failed'){
            console.log(NFTsError);
        }

        if(NFTsMetadataStatus === 'failed'){
            console.log(NFTsError);
        }
    }, [NFTsStatus, NFTsMetadataStatus])


    // useEffect(()=>{
    //     if(NFTs.length > 0){
    //         if(NFTs[0].image !== ''){
    //             img.current.src = NFTs[0].image;
    //         }
    //     }
    // }, [NFTs])

    const [NFTCollection, setNFTCollection] = useState([]);
    const displayNextPageNFT = ()=>{

        const amountToDisplay = remainNFTsAmount >= NFTsPerPage ? NFTsPerPage : remainNFTsAmount;
        let NextPageNFTs = [];
        for(let i = displayedNFTsAmount; i < displayedNFTsAmount + amountToDisplay; i++){
            NextPageNFTs.push(<NFTBlock index={i} key={uuidv4()}/>)
            if(NFTs[i].metadataStatus === 'idle'){
                dispatch(fetchNFTMetadata(i));
            }
        }
        setNFTCollection(prev=>[...prev, NextPageNFTs]);

        dispatch(addDisplayedPage());
    }


    const NextpageNFTButton = remainNFTsAmount !== 0 ? <div onClick={displayNextPageNFT}>Display more</div> : '';


    useEffect(()=>{

        return ()=>{
            dispatch(clearDisplayedPage());
        }
    }, []);

    return (
        <>
            {/* <img ref={img} alt=""></img> */}
            <div className='NFTCollectionView'>
                <div className='NFTCollection'>
                    {NFTCollection}
                    {NextpageNFTButton}
                </div>
            </div>
            
            {NFTOpened && <NFTInfoBlock/>}
        </>
    )
}

export default NFTCollection