import { createSlice } from "@reduxjs/toolkit"

export const feStateSlice = createSlice({
    name: "feState",
    initialState: {
        state: "homeRoom",
        roomId: "",
        playerType: null
    },
    reducers: {
        setState: (state, action) => {
            state.state = action.payload
        },
        setRoomId: (state, action) => {
            state.roomId = action.payload
        },
        setPlayerType: (state, action) => {
            state.playerType = action.payload
        }
    }

})

export const { setState, setRoomId, setPlayerType } = feStateSlice.actions
export default feStateSlice.reducer