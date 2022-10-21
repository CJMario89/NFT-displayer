import { configureStore } from '@reduxjs/toolkit'
import walletReducer from '../features/WalletSlice'
import NFTsReducer from '../features/NFTsSlice'
import MessageReducer from '../features/MessageSlice'

export const store = configureStore({
    reducer: {
        wallet: walletReducer,
        NFTs: NFTsReducer,
        message: MessageReducer
    },
})