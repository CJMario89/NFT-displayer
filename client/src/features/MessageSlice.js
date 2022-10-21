import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    data: [],
    counter: 0,
}

export const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        alertMsg: (state, action) => {
            state.data.push(action.payload)
            state.counter++
        },
        removeMsg: (state, action) =>{
            state.data = state.data.filter((msg)=>{
                return msg !== action.payload
            })
            state.counter = 0;
        }
    }
})


export const alertMsg = messageSlice.actions.alertMsg
export const removeMsg = messageSlice.actions.removeMsg

export const selectMsgCounter = state => state.message.counter
export const selectMessage = state => state.message.data

export default messageSlice.reducer

