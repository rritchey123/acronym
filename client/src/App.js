import React, { useCallback, useEffect } from 'react'
import socket from './socket'

import { setConnectionState } from './redux/connectionState'
import {
    setRoomName,
    setPlayers,
    setAcronym,
    setPrompt,
    setAnswers,
    setVotes,
} from './redux/feState'

import { useSelector, useDispatch } from 'react-redux'
import { DebugDetails } from './components/Misc/DebugDetails/DebugDetails.component'
import { HomeRoom } from './components/Rooms/HomeRoom/HomeRoom.component'
import { WaitRoom } from './components/Rooms/WaitRoom/WaitRoom.component'
import { PlayRoom } from './components/Rooms/PlayRoom/PlayRoom.component'
import { EndRoom } from './components/Rooms/EndRoom/EndRoom.component'
import { VoteRoom } from './components/Rooms/VoteRoom/VoteRoom.component'
import { SummaryRoom } from './components/Rooms/SummaryRoom/SummaryRoom.component'

export default function App() {
    console.log('RE-RENDERING APP COMPONENT')
    const { roomName } = useSelector((state) => state.feState)
    const dispatch = useDispatch()

    useEffect(() => {
        function onConnect() {
            dispatch(setConnectionState(true))
        }

        function onDisconnect() {
            dispatch(setConnectionState(false))
        }

        function gameStarted(payload) {
            const { success, reason, data } = payload
            if (!success) {
                alert(reason)
                return
            }
            console.log('GAME STARTED')
            dispatch(setRoomName('playRoom'))
        }

        function gameEnded(payload) {
            const { success, reason, data } = payload
            if (!success) {
                alert(reason)
                return
            }
            console.log('GAME ENDED')

            dispatch(setRoomName('endRoom'))
        }

        function updatePlayers(payload) {
            const { success, reason, data } = payload
            const { room } = data
            if (!success) {
                alert(reason)
                return
            }
            console.log('UPDATING PLAYERS')
            dispatch(setPlayers(room.players))
            dispatch(setAcronym(room.acronym))
            dispatch(setPrompt(room.prompt))
        }

        function voteReady(payload) {
            const { success, reason, data } = payload
            const { room } = data
            if (!success) {
                alert(reason)
                return
            }
            console.log('SETTING STATE TO VOTE READY')
            dispatch(setRoomName('voteRoom'))
            dispatch(setAnswers(data.answers))
        }

        function summaryReady(payload) {
            const { success, reason, data } = payload
            if (!success) {
                alert(reason)
                return
            }
            dispatch(setRoomName('summaryRoom'))
            dispatch(setVotes(data.votes))
        }

        socket.on('connect', onConnect)
        socket.on('disconnect', onDisconnect)
        socket.on('game-started', gameStarted)
        socket.on('game-ended', gameEnded)
        socket.on('update-players', updatePlayers)
        socket.on('vote-ready', voteReady)
        socket.on('summary-ready', summaryReady)

        return () => {
            socket.off('connect', onConnect)
            socket.off('disconnect', onDisconnect)
            socket.off('game-started', gameStarted)
            socket.off('game-ended', gameEnded)
            socket.off('update-players', updatePlayers)
            socket.off('vote-ready', voteReady)
            socket.off('summary-ready', summaryReady)
        }
    }, [])

    const getRoom = useCallback(() => {
        switch (roomName) {
            case 'homeRoom':
                return <HomeRoom />
            case 'waitRoom':
                return <WaitRoom />
            case 'playRoom':
                return <PlayRoom />
            case 'endRoom':
                return <EndRoom />
            case 'voteRoom':
                return <VoteRoom />
            case 'summaryRoom':
                return <SummaryRoom />
            default:
                return <HomeRoom />
        }
    }, [roomName])

    return (
        <>
            <DebugDetails roomName="Home Room"></DebugDetails>
            {getRoom()}
        </>
    )
}
