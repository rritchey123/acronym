export enum PlayerType {
    NORMAL = 'normal',
    LEADER = 'leader',
}

export enum PlayerStatus {
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected',
}

export interface Player {
    id: string
    socketId: string
    name: string
    type: PlayerType
    // Later thing
    offset?: number // offset in time when user sent first message to when server receives it
    status: PlayerStatus
}

export enum RoomStatus {
    WAITING = 'waiting',
    PLAYING = 'playing',
    VOTING = 'voting',
    REVIEWING_ROUND_SUMMARY = 'reviewing_round_summary',
    REVIEWING_SCORE_SUMMARY = 'reviewing_score_summary',
}

export interface VotesMap {
    [key: string]: number
}

export interface ScoresMap {
    [key: string]: number
}

export interface AnswerObject {
    playerId: string
    answer: string
}

export interface Room {
    id: string
    status: RoomStatus
    acronym?: string
    prompt?: string
    isGameOver: boolean
    round: number
    answers: AnswerObject[]
    votes: VotesMap
    scores: ScoresMap
    players: Player[]
    acronymSuggestions: string[]
    promptSuggestions: string[]
    roundStartTime?: string
    defaultRoundDuration: number
    currentRoundDuration: number
    scoreLimit: number
    nextRoundCallback?: NodeJS.Timeout
}

export interface ServerToClientEvents {
    ['update-players']: (payload: Room) => void
}

export type WebsocketCallbackPayload<T = any> = {
    success: boolean
    data?: T
}

export interface ClientToServerEvents {
    ['create-room']: (cb: (payload: WebsocketCallbackPayload) => void) => void
    ['join-room']: (
        payload: {
            roomId: string
            playerName: string
            playerType: PlayerType
        },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['start-game']: (
        payload: { roomId: string },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['leave-room']: (
        payload: { roomId: string; playerId: string },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['submit-answer']: (
        payload: { roomId: string; playerId: string; answer: string },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['submit-vote']: (
        payload: { roomId: string; playerId: string },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['review-round-scores']: (
        payload: { roomId: string },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['review-game-scores']: (
        payload: { roomId: string },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['start-next-round']: (
        payload: { roomId: string },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['suggest']: (
        payload: {
            roomId: string
            suggestionType: SuggestionType
            suggestion: string
        },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['update-game-rules']: (
        payload: {
            roomId: string
            defaultRoundDuration: number
            scoreLimit: number
        },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['add-time']: (
        payload: {
            roomId: string
        },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['reconnect']: (
        payload: {
            playerId: string
            roomId: string
        },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
}

export enum SuggestionType {
    ACRONYM = 'Acronym',
    PROMPT = 'Prompt',
}
