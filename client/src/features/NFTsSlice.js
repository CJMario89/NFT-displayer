import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { getNFTOwnersByWeb3 } from './useWeb3';
import { v4 as uuidv4 } from 'uuid';

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
//     owners: [],
//     isVideo: false, //boolean
//     tokenURI: '', //string
//     metadata: null, //metadata
//     metadataStatus: idle, // 'idle' | 'successed' | 'failed' | 'pending'
//     imgStatus: idle // 'idle' | 'successed' | 'failed' | 'pending'
//     ownersStatus: idle // 'idle' | 'successed' | 'failed' | 'pending'
//     refreshSignal: false, //refresh data
//     key: key, // prevent race condition for account changing frequently
//     complete: false, // render after completing 
// }

const key = uuidv4();
const initialState = {
    NFTs: [], //NFT[]
    total: 0, //number
    displayedPage: 0, //number 0->25 1->50 2->75
    cursor: '', //string
    open: -1, //index
    chain: ['eth', 'bsc', 'polygon'],
    chainId: [1, 56, 137],
    fetchedChain: 0, //0-2
    status: 'idle', // 'idle' | 'successed' | 'failed' | 'pending'
    error: '',
    refreshSignal: false,
    key: key,
    complete: false // render after completing 
}

export const getNFTs = createAsyncThunk('NFTs/getNFTs', async(arg , thunkAPI) => {
    const {address, key} = arg;
    const state = thunkAPI.getState().NFTs;

    try{
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
                return {'data': response.data, 'key': key};
            })
    }catch(err){
        return thunkAPI.rejectWithValue("failed");
    }
});

export const fetchNFTMetadata = createAsyncThunk('NFTs/fetchNFTMetadata', async({index, key}, thunkAPI)=>{
    const state = thunkAPI.getState().NFTs;
    let token_uri = null;
    let metadata = null;
    // const token_address = state.NFTs[index].tokenAddress;
    // const token_id = state.NFTs[index].tokenId;
    

    try{

        // //get token_uri from blockchain
        // const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/4442b8b396684ed2a3e98f9e1772cdb0'))
        // const abi = await fetch('/ERC721-ABI.json')
        // .then(response=>{
        //     return response.json()
        // })

        // const contract = new web3.eth.Contract(abi, token_address);
        // token_uri = await contract.methods.tokenURI(token_id).call();
        

        // //get metadata from blockchain
        // if(token_uri !== '' && token_uri !== null && token_uri !== undefined){

        //     if(token_uri.includes('ipfs://')){
        //         token_uri = token_uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
        //     }

        //     //some token_uri is json
        //     if(token_uri.includes("data:application/json;base64,")){
        //         const raw = token_uri.replace("data:application/json;base64,", "");
        //         const jsonString = Buffer.from(raw, 'base64').toString();
        //         console.log(`%c${jsonString}`,'color:blue')
        //         const json = await JSON.parse(jsonString);
        //         if(json !== null && json !== undefined && json !== ''){
        //             metadata = json;
        //         }
        //     }

        //     if(token_uri.includes('ipfs://')){
        //         token_uri = token_uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
        //     }
        //     //get metadata from blockchain
        //     metadata = await axios.request({ url: token_uri, method: "get", responseType: "applicatio/json" })
        //         .then(function (response) {
        //              if(response.status !== 200){
        //                  thunkAPI.rejectWithValue('failed');
        //              }
        //             return response.data;
        //         })
        //         .catch(function (error) {
        //         });
        // }
        
        //from moralis
        metadata = state.NFTs[index].metadata;
        token_uri = state.NFTs[index].tokenURI;

        

        //still no data
        if(metadata === null || typeof metadata === "undefined" || metadata === ''){
            //get from moralis token_uri
            if(token_uri !== 'Invalid uri'){
                metadata = await axios.request(token_uri)
                    .then(function (response) {
                        if(response.status !== 200){
                            thunkAPI.rejectWithValue('failed');
                        }
                        return response.data;
                    })
            }

            
            //still no any data then return 
            if(metadata === null || typeof metadata === "undefined" || metadata === ''){
                return thunkAPI.rejectWithValue('failed');
            }
        }
        

        return {'data': metadata, 'key': key};
    }catch(err){
        return thunkAPI.rejectWithValue(err);
    } 
});


export const fetchNFTImg = createAsyncThunk('NFTs/fetchNFTImg', async({index, key}, thunkAPI)=>{
    const state = thunkAPI.getState().NFTs;
    // const token_address = state.NFTs[index].tokenAddress;
    // const token_id = state.NFTs[index].tokenId;
    const metadata = state.NFTs[index].metadata;
    let image_url;

    try{

    

        // //no metadata
        // if(metadata === null){
        //     //get from opnsea
        //     image_url = await axios.request(
        //         {
        //             method: 'GET',
        //             url: `https://api.opensea.io/api/v1/asset/${token_address}/${token_id}/?include_orders=false`,
        //             headers: { 'Accept': "application/json", 'X-API-KEY': 'c9128ae930224cabac7af252a18759a1' }
        //         })
        //     .then((response)=>{
        //         return response.json();
        //     })
        //     .then((response)=>{
        //         return response.image_url;
        //     })
        //     .catch(()=>{
        //         thunkAPI.rejectWithValue("failed");
        //     })

        //     if(image_url === null || image_url === undefined || image_url === ''){
        //         return { image: null, isVideo: false };
        //     }
        // }

        //get from opensea or metadata
        if(metadata !== null && typeof metadata !== "undefined" && metadata !== ''){
            image_url = metadata.image;
        }
        

        if(image_url !== null && typeof image_url !== "undefined" && image_url !== ''){
            const isVideo = (image_url.includes(".mp4") || image_url.includes(".webm")) ? true : false;

            //some image_uri is blob
            if(image_url.includes('data:image/') && image_url.includes('base64')){
                return {'data': { image: image_url, isVideo: isVideo }, 'key':key};
            }



            if(image_url.includes('ipfs://')){
                image_url = image_url.replace('ipfs://', 'https://ipfs.io/ipfs/');
            }
            
            //get from image_url
            let image = await axios.request({ url: image_url, method: "get", responseType: "blob" })
                .then(function (response) {
                    if(response.status !== 200){
                        return thunkAPI.rejectWithValue('failed');
                    }
                    return response.data;
                })
                .then(function(blob){
                    return blob !== null ? URL.createObjectURL(blob) : null;
                })
                

            if(image !== null && typeof image !== "undefined" && image !== ''){
                return {'data':{ image: image, isVideo: isVideo }, 'key':key};
            }
        }
        return thunkAPI.rejectWithValue('failed');

    }catch(err){
        return thunkAPI.rejectWithValue(err);
    }
});



export const getNFTOwners = createAsyncThunk('NFTs/getNFTOwners', async({index, key}, thunkAPI)=>{
    const state = thunkAPI.getState().NFTs;
    const token_address = state.NFTs[index].tokenAddress;
    const token_id = state.NFTs[index].tokenId;
    const chain = state.NFTs[index].chain;
    const contract_type = state.NFTs[index].contractType;

    if(contract_type === 'ERC721'){
        try{
            const owner = await getNFTOwnersByWeb3(token_address, token_id, chain, contract_type);
            // console.log(owner)
            return {'data':{'result': [{
                'owner_of': owner,
                'amount': 1
            }]}, 'key':key};
        }catch(err){
            return thunkAPI.rejectWithValue('failed');
        }
    }


    const options = {
        method: 'GET',
        url: `https://deep-index.moralis.io/api/v2/nft/${token_address}/${token_id}/owners`,
        params: {
            chain: chain,
            format: 'decimal',
            limit: 10
        },
        headers: {accept: 'application/json', 'X-API-Key': 'qenwkvrytGvQJBx6aAdOd4ILIFYWZCn87ESMGceEx5pKIsKSPwOsEtPKzhr9XhPs'}
      };
      
    try{
        return axios
        .request(options)
        .then(function (response) {
            // console.log(response.data)
            return {'data': response.data, 'key':key};
        })
        .catch(function (error) {
        console.error(error);
        });
    }catch(err){
        return thunkAPI.rejectWithValue('failed');
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
            state.open = action.payload
        },
        clearOpen: (state)=>{
            state.open = -1;
        },
        refreshNFTs: (state)=>{ //after empty layout rendered start fetching 
            state.fetchedChain = 0;
            state.status = 'idle';
            state.cursor = null;
            state.refreshSignal = false;
        },
        setRefreshSignal: (state)=>{ //init first
            state.key = uuidv4();
            state.refreshSignal = true;
            const empty = [];
            state.NFTs = empty;
            state.total = 0;
            state.open = -1;
            state.error = '';
            state.complete = false;
            state.displayedPage = 0;
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(getNFTs.fulfilled, (state, action)=>{
            if(state.key !== action.payload.key){ // last query return
                return;
            }            
            const key = action.payload.key;
            
            state.status = 'successed'
            state.total = (action.payload.data.cursor === null) ? state.total + action.payload.data.total : state.total;
            state.cursor = action.payload.data.cursor;
            action.payload.data.result.forEach(nft => {
                const metadata = (nft.metadata !== null) ? JSON.parse(nft.metadata) : null;
                const NFT = {
                    chain: state.chain[state.fetchedChain],
                    chainId: state.chainId[state.fetchedChain],
                    tokenAddress: (nft.token_address !== null ? nft.token_address : "Unknown"),
                    tokenId: nft.token_id,
                    amount: nft.amount,
                    blockNumber: nft.block_number,
                    contractType: nft.contract_type,
                    name: (nft.name !== null ? nft.name : "Unknown"),
                    symbol: (nft.symbol !== null ? nft.symbol : "Unknown"),
                    image: '',
                    owners: [],
                    isVideo: false,
                    tokenURI: nft.token_uri,
                    metadata: metadata,
                    metadataStatus: 'idle',
                    imgStatus: 'idle',
                    ownersStatus: 'idle'
                };
                state.NFTs.push(NFT);
            });
            state.fetchedChain = (action.payload.data.cursor === null && state.fetchedChain < 3) ? state.fetchedChain + 1 : state.fetchedChain;
            if(state.key === key && state.fetchedChain === 3){
                state.complete = true;
            }
        })
        .addCase(getNFTs.rejected, (state, action)=>{
            state.status = 'failed'
            state.error = action.error.message
        })
        .addCase(getNFTs.pending, (state)=>{
            state.status = 'pending';
        })
        .addCase(fetchNFTMetadata.fulfilled, (state, action)=>{
            if(state.key !== action.payload.key){
                return;
            }
            const index = action.meta.arg.index;
            state.NFTs[index].metadataStatus = 'successed';
            state.NFTs[index].metadata = action.payload.data;
            if(action.payload.data !== null){
                if(action.payload.data.hasOwnProperty('name')){
                    state.NFTs[index].name = action.payload.data.name;
                }
            }
        })
        .addCase(fetchNFTMetadata.pending, (state, action)=>{
            const index = action.meta.arg.index;
            if(typeof state.NFTs[index] === "undefined"){
                return;
            }
            state.NFTs[index].metadataStatus = 'pending';
        })
        .addCase(fetchNFTMetadata.rejected, (state, action)=>{
            const index = action.meta.arg.index;
            state.error = action.error.message;
            if(typeof state.NFTs[index] === "undefined"){
                return;
            }
            state.NFTs[index].metadataStatus = 'failed';
        })
        .addCase(fetchNFTImg.fulfilled, (state, action)=>{
            if(state.key !== action.payload.key){
                return;
            }
            const index = action.meta.arg.index;
            state.NFTs[index].imgStatus = 'successed';
            state.NFTs[index].image = action.payload.data.image
            // console.log(action.payload.data.image)
            state.NFTs[index].isVideo = action.payload.data.isVideo
        })
        .addCase(fetchNFTImg.pending, (state, action)=>{
            const index = action.meta.arg.index;
            if(typeof state.NFTs[index] === "undefined"){
                return;
            }
            state.NFTs[index].imgStatus = 'pending';
        })
        .addCase(fetchNFTImg.rejected, (state, action)=>{
            const index = action.meta.arg.index;
            state.error = action.error.message;
            if(typeof state.NFTs[index] === "undefined"){
                return;
            }
            state.NFTs[index].imgStatus = 'failed';
        })
        .addCase(getNFTOwners.fulfilled, (state, action)=>{
            if(state.key !== action.payload.key){
                return;
            }
            const index = action.meta.arg.index;
            state.NFTs[index].ownersStatus = 'successed';
            const owners = [];
            action.payload.data.result.forEach(nft => {
                const owner = {
                    'owner': nft.owner_of,
                    'amount': nft.amount
                }
                owners.push(owner);
            })
            state.NFTs[index].owners = owners;
        })
        .addCase(getNFTOwners.rejected, (state, action)=>{
            const index = action.meta.arg.index;
            state.error = action.error.message;
            if(typeof state.NFTs[index] === "undefined"){
                return;
            }
            state.NFTs[index].ownersStatus = 'failed';
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
export const selectNFTsError = state => state.NFTs.error;
export const selectNFTsRefreshSignal = state => state.NFTs.refreshSignal;
export const selectNFTsKey = state => state.NFTs.key;
export const selectNFTsComplete = state => state.NFTs.complete;

export const { addDisplayedPage, clearDisplayedPage, setOpen, clearOpen, refreshNFTs, setRefreshSignal } = NFTsSlice.actions;

export default NFTsSlice.reducer