export enum PlayerType {
    NORMAL = 'normal',
    LEADER = 'leader',
}

export interface Player {
    id: string
    name: string
    type: PlayerType
    // Later thing
    offset?: number // offset in time when user sent first message to when server receives it
}

export enum RoomStatus {
    WAITING = 'waiting',
    PLAYING = 'playing',
    VOTING = 'voting',
    REVIEWING_ROUND_SUMMARY = 'reviewing_round_summary',
    REVIEWING_SCORE_SUMMARY = 'reviewing_score_summary',
}

export interface AnswersMap {
    [key: string]: string
}
export interface VotesMap {
    [key: string]: number
}

export interface ScoresMap {
    [key: string]: number
}
export interface PlayersMap {
    [key: string]: Player
}

export interface Room {
    id: string
    status: RoomStatus
    acronym?: string
    prompt?: string
    isGameOver: boolean
    round: number
    answers: AnswersMap
    votes: VotesMap
    scores: ScoresMap
    players: PlayersMap
    acronymSuggestions: string[]
    promptSuggestions: string[]
    roundStartTime?: string
    defaultRoundDuration: number
    roundDuration?: number
}

export interface ServerToClientEvents {
    ['update-players']: (payload: Room) => void
}

export type WebsocketCallbackPayload<T = any> = {
    success: boolean
    data?: T
}

export interface ClientToServerEvents {
    ['create-room']: (
        payload: { defaultRoundDuration: number },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
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
        payload: { roomId: string },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['submit-answer']: (
        payload: { roomId: string; answer: string },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['submit-vote']: (
        payload: { roomId: string; playerId: string },
        cb: (payload: WebsocketCallbackPayload) => void
    ) => void
    ['review-scores']: (
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
}

export enum SuggestionType {
    ACRONYM = 'Acronym',
    PROMPT = 'Prompt',
}
