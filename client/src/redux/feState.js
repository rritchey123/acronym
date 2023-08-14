import { createSlice } from "@reduxjs/toolkit"

export const feStateSlice = createSlice({
    name: "feState",
    initialState: {
        feState: "home",
        roomId: ""
    },
    reducers: {
        setFeState: (state, action) => {
            state.feState = action.payload
        },
        setRoomId: (state, action) => {
            state.roomId = action.payload
        }
    }
})

export const { setFeState, setRoomId } = feStateSlice.actions
export default feStateSlice.reducer