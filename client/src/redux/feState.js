import { createSlice } from "@reduxjs/toolkit"

export const feStateSlice = createSlice({
    name: "feState",
    initialState: {
        feState: "home"
    },
    reducers: {
        setFeState: (state, action) => {
            state.feState = action.payload
        }
    }
})

export const { setFeState } = feStateSlice.actions
export default feStateSlice.reducer