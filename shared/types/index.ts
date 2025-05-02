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

export enum RoomStatus {
    WAITING = 'waiting',
    PLAYING = 'playing',
    ENDED = 'ended',
}

export interface Room {
    status: RoomStatus
    acronym?: string
    prompt?: string
    isGameOver: boolean
    round: number
    votes: Record<string, number>
    scores: Record<string, number>
    players: Record<string, Player>
}
