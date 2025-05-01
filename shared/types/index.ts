export enum PlayerType {
    NORMAL = 'normal',
    LEADER = 'leader',
}

export interface Player {
    id: string
    name: string
    type: PlayerType
    currentAnswer?: string
}

export enum StateValue {
    WAITING = 'waiting',
    PLAYING = 'playing',
    ENDED = 'ended',
}

export interface RoomState {
    stateValue: StateValue
    acronym?: string
    prompt?: string
    votes: Record<string, number>
    round: number
    scores: Record<string, number>
    isGameOver: boolean
}

export interface Room {
    state: RoomState
    players: Player[]
}
