import Web3 from "web3";



const getBlockLogByBinarySearch = async (from, to, contract, event)=>{
    return await contract.getPastEvents(event, {
        filter: {
            _from: '0x0000000000000000000000000000000000000000'
        },
        fromBlock: from,
        toBlock: to
    }).then((events) => {
        for (let event of events) {
            if(window.contract_token_ids.indexOf(event.returnValues.tokenId) === -1){
                window.contract_token_ids.push(event.returnValues.tokenId);
                console.log(event.returnValues)
            }
        }
        return;
    }).catch(async(err)=>{
        window.binarySearchTimes++;
        console.log(err);
        if(to-from <= 0){
            return;
        }
        if(window.binarySearchTimes > 30){
            return;
        }
        let middle = Math.floor((to + from) / 2);
        await getBlockLogByBinarySearch(from, middle, contract, event);
        await getBlockLogByBinarySearch(middle + 1, to, contract, event);
        return;
    })
}



const createContract = async (contractAddress, chain, contract_type)=>{
    const abi = await fetch(`/${contract_type}-ABI.json`)
    .then(response=>{
        return response.json()
    })

    const providers = {
        'eth': 'https://mainnet.infura.io/v3/1f9ca76803de40b4b081c9d89dd407fb',
        'bsc': "https://hardworking-divine-ensemble.bsc.discover.quiknode.pro/43958efedb5ffdfbb03ed542992a33da7b09a51f/",
        'polygon': 'https://polygon-rpc.com'
    }

    const web3 = new Web3(new Web3.providers.HttpProvider(providers[chain]));
    // const web3 = new Web3(window.provider);

    const contract = new web3.eth.Contract(abi, contractAddress);
    return {web3, contract};
}


export const getContractTokenIds = async(contractAddress, chain, contract_type)=>{
    window.binarySearchTimes = 0;
        
    const {web3, contract} = await createContract(contractAddress, chain, contract_type);
    const blockNumber = await web3.eth.getBlockNumber();

    const from = 0;
    const to = blockNumber;
    const middle = Math.floor((to + from) / 2);

    const event = contract_type === 'ERC721' ? 'Transfer' : 'TransferSingle';
    await getBlockLogByBinarySearch(from, middle, contract, event);
    await getBlockLogByBinarySearch(middle + 1, to, contract, event);
    return; 
}


export const getNFTOwnersByWeb3 = async(contractAddress, tokenId, chain, contract_type)=>{
    
    const {contract} = await createContract(contractAddress, chain, contract_type);

    const owner = await contract.methods.ownerOf(tokenId).call();

    return owner;
}



export const approveNFT = async (contractAddress, tokenId, chainId, contract_type, to)=>{
    const abi = await fetch(`/${contract_type}-ABI.json`)
    .then(response=>{
        return response.json()
    })
    const chain_id = await window.web3.eth.getChainId()
    if(chainId !== chain_id){
        console.log(chainId)
        console.log(chain_id)
        try{
            await window.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: window.web3.utils.toHex(chainId) }]
            });
            localStorage.clear();
            localStorage.setItem("walletconnect", null);
            localStorage.setItem("providerName", null);
            localStorage.setItem("wallet_address", null);
            window.location.reload();
        }catch(err){
            throw err;
        }
    }
    const contract = new window.web3.eth.Contract(abi, contractAddress);
    try{
        const from = localStorage.getItem('wallet_address');
        const estimateGasApprove = await contract.methods.approve(to, tokenId).estimateGas({from: from});
        const result = await contract.methods.approve(to, tokenId).send({from: from, gas: estimateGasApprove});
        if(result !== undefined){
            return;
        }
    }catch(err){
        throw err;
    }
    
}


export const transferNFT = async (contractAddress, tokenId, chainId, contract_type, to)=>{
    const abi = await fetch(`/${contract_type}-ABI.json`)
    .then(response=>{
        return response.json()
    })
    const chain_id = await window.web3.eth.getChainId()
    if(chainId !== chain_id){
        try{
            await window.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: window.web3.utils.toHex(chainId) }]
            });
            localStorage.clear();
            localStorage.setItem("walletconnect", null);
            localStorage.setItem("providerName", null);
            localStorage.setItem("wallet_address", null);
            window.location.reload();
        }catch(err){
            throw err;
        }
    }
    const contract = new window.web3.eth.Contract(abi, contractAddress);
    try{
        const from = localStorage.getItem('wallet_address');
        const estimateGas = await contract.methods.safeTransferFrom( from, to, tokenId).estimateGas({from: from});
        const result = await contract.methods.safeTransferFrom( from, to, tokenId).send({from: from, gas: estimateGas});
        if(result !== undefined){
            return;
        }
    }catch(err){
        throw err;
    }
    
}