import React, { useCallback, useEffect } from 'react'
import socket from './socket.js'

import { setConnectionState } from './redux/connectionState.js'
import {
    setRoomName,
    setPlayers,
    setAcronym,
    setPrompt,
    setAnswers,
    setVotes,
    setRound,
    setScores,
    setIsGameOver,
} from './redux/feState.js'

import { useSelector, useDispatch } from 'react-redux'
import { DebugDetails } from './components/Misc/DebugDetails/DebugDetails.component.jsx'
import { HomeRoom } from './components/Rooms/HomeRoom/HomeRoom.component.jsx'
import { WaitRoom } from './components/Rooms/WaitRoom/WaitRoom.component.jsx'
import { PlayRoom } from './components/Rooms/PlayRoom/PlayRoom.component.jsx'
import { EndRoom } from './components/Rooms/EndRoom/EndRoom.component.jsx'
import { VoteRoom } from './components/Rooms/VoteRoom/VoteRoom.component.jsx'
import { RoundSummaryRoom } from './components/Rooms/RoundSummaryRoom/RoundSummaryRoom.component.jsx'
import { ScoreReviewRoom } from './components/Rooms/ScoreReviewRoom/ScoreReviewRoom.component.jsx'

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
            dispatch(setRound(room.round))

            dispatch(setIsGameOver(room.isGameOver))
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

        function roundSummaryReady(payload) {
            const { success, reason, data } = payload
            if (!success) {
                alert(reason)
                return
            }
            dispatch(setRoomName('roundSummaryRoom'))
            dispatch(setVotes(data.votes))
        }

        function reviewScores(payload) {
            const { success, reason, data } = payload
            if (!success) {
                alert(reason)
                return
            }
            dispatch(setScores(data))
            dispatch(setRoomName('scoreReviewRoom'))
        }

        function nextRoundStarted(payload) {
            const { success, reason, data } = payload
            if (!success) {
                alert(reason)
                return
            }
            dispatch(setRoomName('playRoom'))
        }

        socket.on('connect', onConnect)
        socket.on('disconnect', onDisconnect)
        socket.on('game-started', gameStarted)
        socket.on('game-ended', gameEnded)
        socket.on('update-players', updatePlayers)
        socket.on('vote-ready', voteReady)
        socket.on('round-summary-ready', roundSummaryReady)
        socket.on('review-scores', reviewScores)
        socket.on('next-round-started', nextRoundStarted)

        return () => {
            socket.off('connect', onConnect)
            socket.off('disconnect', onDisconnect)
            socket.off('game-started', gameStarted)
            socket.off('game-ended', gameEnded)
            socket.off('update-players', updatePlayers)
            socket.off('vote-ready', voteReady)
            socket.off('round-summary-ready', roundSummaryReady)
            socket.off('review-scores', reviewScores)
            socket.off('next-round-started', nextRoundStarted)
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
            case 'roundSummaryRoom':
                return <RoundSummaryRoom />
            case 'scoreReviewRoom':
                return <ScoreReviewRoom />
            default:
                return <HomeRoom />
        }
    }, [roomName])

    return (
        <div className="pt-16 bg-background h-screen">
            {/* <DebugDetails roomName="Home Room"></DebugDetails> */}
            {getRoom()}
        </div>
    )
}
