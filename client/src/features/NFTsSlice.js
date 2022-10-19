import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// const metadata = {
//     name: '', //string
//     description: '', //string
//     attribute: [], //{trait_type:'',value:''}[]
//     image: '' // string (image, image_url)
// }

// const NFT = {
//     tokenAddress: '', //string
//     tokenId: 0, //number
//     amount: 0, //number
//     blockNumber: 0, //number
//     contractType: 'ERC721',//ERC721, ERC1155
//     name: '', //string
//     symbol: '', //string
//     image: '', //blob //take from IPFS or others
//     isVideo: false, //boolean
//     tokenURI: '', //string
//     metadata: null, //metadata
//     metadataStatus: idle, // 'idle' | 'successed' | 'failed' | 'pending'
//     openseaImgStatus: idle // 'idle' | 'successed' | 'failed' | 'pending'
// }

const initialState = {
    NFTs: [], //NFT[]
    total: 0, //number
    displayedPage: 0, //number 0->25 1->50 2->75
    cursor: '', //string
    open: null, //NFT
    chain: ['eth', 'bsc', 'polygon'],
    fetchedChain: 0, //0-2
    status: 'idle', // 'idle' | 'successed' | 'failed' | 'pending'
    error: ''
}

export const getNFTs = createAsyncThunk('NFTs/getNFTs', async(address, { getState }) => {
    const state = getState().NFTs;
    return await axios.request({
            method: 'GET',
            url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
            headers: {accept: 'application/json', 'X-API-Key': 'qenwkvrytGvQJBx6aAdOd4ILIFYWZCn87ESMGceEx5pKIsKSPwOsEtPKzhr9XhPs'},
            params: {
                chain: state.chain[state.fetchedChain],
                format: 'decimal',
                cursor: state.cursor
            }
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });
});

export const fetchNFTMetadata = createAsyncThunk('NFTs/fetchNFTMetadata', async(index, thunkAPI)=>{
    const state = thunkAPI.getState().NFTs;
    let metadata = state.NFTs[index].metadata;
    const token_uri = state.NFTs[index].tokenURI;
    

    if(metadata === null){
        if(token_uri !== 'Invalid uri'){
            metadata = await axios.request(token_uri)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    // console.error(error);
                });
        }
        if(metadata === null || metadata === undefined || metadata === ''){
            return { metadata: null, image: null, index: index, isVideo: isVideo };
        }
    }

    // console.log(index);
    // console.log(metadata);
    let image_url = metadata.image;
    if(image_url.includes('ipfs://')){
        image_url = image_url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }


    if(image_url.includes('data:image/') && image_url.includes('base64')){
        return { metadata: metadata, image: image_url, index: index };
    }
    
    const image = await axios.request({ url: image_url, method: "get", responseType: "blob" })
        .then(function (response) {
            return response.data;
        })
        .then(function(blob){
            return blob !== null ? URL.createObjectURL(blob) : null;
        })
        .catch(function (error) {
            thunkAPI.rejectWithValue("failed");
        });

    
    const isVideo = (image_url.includes(".mp4") || image_url.includes(".webm")) ? true : false;
    return { metadata: metadata, image: image, index: index, isVideo: isVideo};        
});


export const fetchOpenSeaImg = createAsyncThunk('NFTs/fetchOpenSeaImg', async(index, thunkAPI)=>{
    const state = thunkAPI.getState().NFTs;
    const token_address = state.NFTs[index].tokenAddress;
    const token_id = state.NFTs[index].tokenId;
    const options = {method: 'GET',  headers: { 'Accept': "application/json", 'X-API-KEY': 'c9128ae930224cabac7af252a18759a1' }};
    const raw = await axios(`https://api.opensea.io/api/v1/asset/${token_address}/${token_id}/?include_orders=false`, options)
    if(raw.ok){
        const response = await raw.json();
        return response.image_url;
    }else{
        thunkAPI.rejectWithValue("failed");
    }
});


export const NFTsSlice = createSlice({
    name: 'NFTs',
    initialState,
    reducers:{
        addDisplayedPage: (state)=>{
            state.displayedPage++;
        },
        clearDisplayedPage: (state)=>{
            state.displayedPage = 0;
        },
        setOpen: (state, action)=>{
            const index = action.payload;
            state.open = state.NFTs[index];
        },
        clearOpen: (state)=>{
            state.open = null;
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(getNFTs.fulfilled, (state, action)=>{
            state.status = 'successed'
            state.total = (action.payload.cursor === null) ? state.total + action.payload.total : state.total;
            state.cursor = action.payload.cursor;
            action.payload.result.forEach(nft => {
                const metadata = (nft.metadata !== null) ? JSON.parse(nft.metadata) : null;
                const NFT = {
                    chain: state.chain[state.fetchedChain],
                    tokenAddress: (nft.token_address !== null ? nft.token_address : "Unknown"),
                    tokenId: nft.token_id,
                    amount: nft.amount,
                    blockNumber: nft.block_number,
                    contractType: nft.contract_type,
                    name: (nft.name !== null ? nft.name : "Unknown"),
                    symbol: (nft.symbol !== null ? nft.symbol : "Unknown"),
                    image: '',
                    tokenURI: nft.token_uri,
                    metadata: metadata,
                    metadataStatus: 'idle',
                    openseaImgStatus: 'idle'
                };

                state.NFTs.push(NFT);
            });
            state.fetchedChain = (action.payload.cursor === null && state.fetchedChain < 3) ? state.fetchedChain + 1 : state.fetchedChain;
        })
        .addCase(getNFTs.rejected, (state, action)=>{
            state.status = 'failed'
            state.error = action.error.message
        })
        .addCase(getNFTs.pending, (state)=>{
            state.status = 'pending'
        })
        .addCase(fetchNFTMetadata.fulfilled, (state, action)=>{
            const index = action.meta.arg;
            state.NFTs[index].metadataStatus = 'successed';
            state.NFTs[index].metadata = action.payload.metadata
            if(action.payload.metadata!= null){
                if(action.payload.metadata.hasOwnProperty('name')){
                    state.NFTs[index].name = action.payload.metadata.name;
                }
            }
            state.NFTs[index].image = action.payload.image
            state.NFTs[index].isVideo = action.payload.isVideo
        })
        .addCase(fetchNFTMetadata.pending, (state, action)=>{
            const index = action.meta.arg;
            state.NFTs[index].metadataStatus = 'pending';
        })
        .addCase(fetchNFTMetadata.rejected, (state, action)=>{
            const index = action.meta.arg;
            state.NFTs[index].metadataStatus = 'failed';
            state.error = action.error.message;
        })
        .addCase(fetchOpenSeaImg.fulfilled, (state, action)=>{
            const index = action.meta.arg;
            state.NFTs[index].openseaImgStatus = 'successed';
            state.NFTs[index].image = action.payload
        })
        .addCase(fetchOpenSeaImg.pending, (state, action)=>{
            const index = action.meta.arg;
            state.NFTs[index].openseaImgStatus = 'pending';
        })
        .addCase(fetchOpenSeaImg.rejected, (state, action)=>{
            const index = action.meta.arg;
            state.NFTs[index].openseaImgStatus = 'failed';
            state.error = action.error.message;
        })
    }
});


export const selectNFTs = state => state.NFTs.NFTs;
export const selectNFTsTotal = state => state.NFTs.total;
export const selectNFTsDisplayedPage = state => state.NFTs.displayedPage;
export const selectNFTsFetchedChain = state => state.NFTs.fetchedChain;
export const selectNFTsCursor = state => state.NFTs.cursor;
export const selectNFTsOpen = state => state.NFTs.open;
export const selectNFTsStatus = state => state.NFTs.status;
export const selectMetadataStatus = state => state.NFTs.metadataStatus;
export const selectNFTsError = state => state.NFTs.error;

export const { addDisplayedPage, clearDisplayedPage, setOpen, clearOpen } = NFTsSlice.actions;

export default NFTsSlice.reducer