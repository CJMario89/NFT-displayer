import Web3 from "web3";



const getBlockLogByBinarySearch = async (from, to, contract)=>{
    return await contract.getPastEvents('Transfer', {
        filter: {
            _from: '0x0000000000000000000000000000000000000000'
        },
        fromBlock: from,
        toBlock: to
    }).then((events) => {
        for (let event of events) {
            if(window.contract_token_ids.indexOf(event.returnValues.tokenId) === -1){
                window.contract_token_ids.push(event.returnValues.tokenId);
            }
        }
        return;
    }).catch(async(err)=>{
        if(to-from <= 0){
            return;
        }
        let middle = Math.floor((to + from) / 2);
        await getBlockLogByBinarySearch(from, middle, contract);
        await getBlockLogByBinarySearch(middle + 1, to, contract);
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
        'bsc': 'https://bsc-dataseed.binance.org/',
        'polygon': 'https://polygon-rpc.com'
    }

    const web3 = new Web3(new Web3.providers.HttpProvider(providers[chain]));

    const contract = new web3.eth.Contract(abi, contractAddress);
    return {web3, contract};
}


export const getContractTokenIds = async(contractAddress, chain, contract_type)=>{
        
    const {web3, contract} = await createContract(contractAddress, chain, contract_type);
    const blockNumber = await web3.eth.getBlockNumber();

    const from = 0;
    const to = blockNumber;
    const middle = Math.floor((to + from) / 2);


    await getBlockLogByBinarySearch(from, middle, contract);
    await getBlockLogByBinarySearch(middle + 1, to, contract);
    return; 
}


export const getNFTOwner = async(contractAddress, tokenId)=>{
    const abi = await fetch('/ERC721-ABI.json')
    .then(response=>{
        return response.json()
    })
}