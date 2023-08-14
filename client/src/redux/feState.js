import { createSlice } from "@reduxjs/toolkit"

export const feStateSlice = createSlice({
    name: "feState",
    initialState: {
        state: "home",
        roomId: ""
    },
    reducers: {
        setState: (state, action) => {
            state.state = action.payload
        },
        setRoomId: (state, action) => {
            state.roomId = action.payload
        }
    }
})

export const { setState, setRoomId } = feStateSlice.actions
export default feStateSlice.reducer