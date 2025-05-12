import { createSlice } from '@reduxjs/toolkit'
import { Room } from '@shared/index'

export interface FeState {
    room: Room | null
    playerType: string | null
}

export interface ReduxState {
    feState: FeState
}
export const feStateSlice = createSlice({
    name: 'feState',
    initialState: {
        room: null,
        playerType: null,
    },
    reducers: {
        setRoom: (state, action) => {
            state.room = action.payload
        },
        setPlayerType: (state, action) => {
            state.playerType = action.payload
        },
    },
})

export const { setRoom, setPlayerType } = feStateSlice.actions
export default feStateSlice.reducer
