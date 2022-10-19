import './scss/NFTCollection.scss'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addDisplayedPage, clearDisplayedPage, clearOpen, fetchNFTMetadata, getNFTs, selectMetadataStatus, selectNFTs, selectNFTsCursor, selectNFTsDisplayedPage, selectNFTsError, selectNFTsFetchedChain, selectNFTsOpen, selectNFTsStatus, selectNFTsTotal, selectSortNFTsByTime } from '../../features/NFTsSlice';
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
    const NFTsFetchedChain = useSelector(selectNFTsFetchedChain);
    const NFTsStatus = useSelector(selectNFTsStatus);
    const NFTsOpen = useSelector(selectNFTsOpen);
    const NFTsMetadataStatus = useSelector(selectMetadataStatus);
    const NFTsError = useSelector(selectNFTsError);

    const wallet = useSelector(selectWallet);


    const displayedNFTsAmount = useRef(0);
    const remainNFTsAmount = useRef(0);
    const amountToDisplay = useRef(0);

    displayedNFTsAmount.current = NFTsDisplayedPage * NFTsPerPage > NFTsTotal ? NFTsTotal : NFTsDisplayedPage * NFTsPerPage
    remainNFTsAmount.current = NFTsTotal - displayedNFTsAmount.current
    amountToDisplay.current = remainNFTsAmount.current >= NFTsPerPage ? NFTsPerPage : remainNFTsAmount.current

    const [NFTOpen, setNFTOpen] = useState(false);


    useEffect(()=>{
        if(NFTsFetchedChain === 3){
            displayNextPageNFT();
            setNextPageNFTButton(remainNFTsAmount.current !== 0 ? <div onClick={displayNextPageNFT} className="NextpageNFTButton">Display {amountToDisplay.current} more</div> : '');
        }
    }, [NFTsFetchedChain])




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
    const [NextPageNFTButton, setNextPageNFTButton] = useState(null);
    const displayNextPageNFT = ()=>{

        let NextPageNFTs = [];
        for(let i = displayedNFTsAmount.current; i < displayedNFTsAmount.current + amountToDisplay.current; i++){
            NextPageNFTs.push(<NFTBlock index={i} key={uuidv4()}/>)
            if(NFTs[i].metadataStatus === 'idle'){
                dispatch(fetchNFTMetadata(i));
            }
        }
        setNFTCollection(prev=>[...prev, NextPageNFTs]);

        dispatch(addDisplayedPage());
    }
    
    useEffect(()=>{

        return ()=>{
            dispatch(clearDisplayedPage());
            onNFTInfoBlockBackgroundClick();
        }
    }, []);

    useEffect(()=>{
        if(NFTsOpen !== null){
            setNFTOpen(true);
        }
    }, [NFTsOpen])

    const onNFTInfoBlockBackgroundClick = ()=>{
        setNFTOpen(false);
        dispatch(clearOpen());
    }

    return (
        <>
            {/* <img ref={img} alt=""></img> */}
            <div className='NFTCollectionView'>
                <div className='NFTCollection'>
                    {NFTCollection}
                    {NextPageNFTButton}
                </div>
            </div>
            
            {NFTOpen && <NFTInfoBlock onNFTInfoBlockBackgroundClick={onNFTInfoBlockBackgroundClick}/>}
        </>
    )
}

export default NFTCollection