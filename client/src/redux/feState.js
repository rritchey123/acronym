import { createSlice } from '@reduxjs/toolkit'

export const feStateSlice = createSlice({
    name: 'feState',
    initialState: {
        roomName: 'homeRoom',
        roomId: '',
        playerType: null,
        players: [],
        acronym: null,
        prompt: null,
        answers: [],
        votes: [],
    },
    reducers: {
        setRoomName: (state, action) => {
            state.roomName = action.payload
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
        },
        setAnswers: (state, action) => {
            state.answers = action.payload
        },
        setVotes: (state, action) => {
            state.votes = action.payload
        },
    },
})

export const {
    setRoomName,
    setRoomId,
    setPlayerType,
    setPlayers,
    setAcronym,
    setPrompt,
    setAnswers,
    setVotes,
} = feStateSlice.actions
export default feStateSlice.reducer
