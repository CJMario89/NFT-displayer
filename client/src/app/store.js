import { configureStore } from '@reduxjs/toolkit'
import walletReducer from '../features/WalletSlice'
import NFTsReducer from '../features/NFTsSlice'

export const store = configureStore({
    reducer: {
        wallet: walletReducer,
        NFTs: NFTsReducer
    },
})