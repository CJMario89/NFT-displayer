import './scss/NFTCollection.scss'
import React, { useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addDisplayedPage, clearDisplayedPage, clearOpen, fetchNFTMetadata, selectNFTsComplete, selectNFTsDisplayedPage, selectNFTsError, selectNFTsFetchedChain, selectNFTsKey, selectNFTsOpen, selectNFTsStatus, selectNFTsTotal } from '../../features/NFTsSlice';
import NFTBlock from './NFTBlock';
import NFTInfoBlock from './NFTInfoBlock';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../../app/store'



const NFTCollection = (prop) => {
    const { onClickRefreshNFTsButton } = prop;
    const NFTsPerPage = 25;
    const dispatch = useDispatch();
    const NFTsTotal = useSelector(selectNFTsTotal);
    const NFTsDisplayedPage = useSelector(selectNFTsDisplayedPage);
    const NFTsOpen = useSelector(selectNFTsOpen);
    const NFTsComplete = useSelector(selectNFTsComplete);
    const NFTskey = useSelector(selectNFTsKey);
    // const NFTs = useSelector(selectNFTs);



    const displayedNFTsAmount = useRef(0);
    const remainNFTsAmount = useRef(0);
    const amountToDisplay = useRef(0);

    displayedNFTsAmount.current = NFTsDisplayedPage * NFTsPerPage > NFTsTotal ? NFTsTotal : NFTsDisplayedPage * NFTsPerPage
    remainNFTsAmount.current = NFTsTotal - displayedNFTsAmount.current
    amountToDisplay.current = remainNFTsAmount.current >= NFTsPerPage ? NFTsPerPage : remainNFTsAmount.current



    useEffect(()=>{
        if(NFTsComplete === true && NFTsDisplayedPage === 0){
            displayNextPageNFT();
        }

    }, [NFTsComplete, NFTsDisplayedPage])


    const NFTCollection = useRef([]);
    const displayNextPageNFT = ()=>{
        const NFTs = store.getState().NFTs.NFTs;

        let NextPageNFTs = [];
        for(let i = displayedNFTsAmount.current; i < displayedNFTsAmount.current + amountToDisplay.current; i++){
            NextPageNFTs.push(<NFTBlock index={i} key={uuidv4()}/>)
            if(NFTs[i].metadataStatus === 'idle'){
                dispatch(fetchNFTMetadata({'index':i, 'key': NFTskey}));
            }
        }
        NFTCollection.current = [...NFTCollection.current, NextPageNFTs];
        dispatch(addDisplayedPage());
    }


    const NextPageNFTButton = useMemo(()=>{
        if (NFTsComplete === true){
            return remainNFTsAmount.current !== 0 ? <div onClick={displayNextPageNFT} className="NextpageNFTButton">Display {amountToDisplay.current} more</div> : '';
        }
    }, [NFTsComplete, NFTsDisplayedPage, remainNFTsAmount.current, amountToDisplay.current])
    
    useEffect(()=>{

        return ()=>{
            dispatch(clearDisplayedPage());
            onNFTInfoBlockBackgroundClick();
        }
    }, []);


    const onNFTInfoBlockBackgroundClick = ()=>{
        dispatch(clearOpen());
    }


    return (
        <>
            {/* <img ref={img} alt=""></img> */}
            <div className='NFTCollectionView'>
                <div className='NFTCollection'>
                    {NFTCollection.current}
                    {NextPageNFTButton}
                </div>
            </div>
            <div className='refreshNFTsButton' onClick={onClickRefreshNFTsButton}>
                refresh data<br/>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
            </div>
            {NFTsOpen !== -1 && <NFTInfoBlock onNFTInfoBlockBackgroundClick={onNFTInfoBlockBackgroundClick}/>}
        </>
    )
}

export default NFTCollection