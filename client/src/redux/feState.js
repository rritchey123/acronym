import { createSlice } from "@reduxjs/toolkit"

export const feStateSlice = createSlice({
    name: "feState",
    initialState: {
        state: "homeRoom",
        roomId: "",
        playerType: null,
        players: [],
        acronym: null,
        prompt: null
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
        },
        setPlayers: (state, action) => {
            state.players = action.payload
        },
        setAcronym: (state, action) => {
            state.acronym = action.payload
        },
        setPrompt: (state, action) => {
            state.prompt = action.payload
        }

    }

})

export const { setState, setRoomId, setPlayerType, setPlayers, setAcronym, setPrompt } = feStateSlice.actions
export default feStateSlice.reducer