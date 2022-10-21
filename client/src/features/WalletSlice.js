import { createSlice } from '@reduxjs/toolkit'

const wallet = {
    address: '', //string
    providerName: '', //string
    chain_id: 1, //number
    balance: 0
}

const initialState = {
    wallet: wallet, //wallet
    status: 'unconnected', // 'unconnected' | 'connected',
    error: ''
}



export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setupWallet:(state, action)=>{
            state.wallet = action.payload;
            state.status = 'connected';
        },
        removeWallet:(state)=>{
            state.wallet = {
                address: '',
                providerName: '',
                chain_id: 1,
                balance: 0
            };
            window.localStorage.clear();
            localStorage.setItem('providerName', null)
            localStorage.setItem('wallet_address', null)
            state.status = 'unconnected';
        }
    },
})


export const selectWallet = state => state.wallet.wallet;
export const selectWalletStatus = state => state.wallet.status

export const setupWallet = walletSlice.actions.setupWallet;
export const removeWallet = walletSlice.actions.removeWallet;

export default walletSlice.reducer;

