import { PlayerStatus, Room } from '@shared/index'

export function shuffleArray(array: any[]): any[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = newArray[i]
        newArray[i] = newArray[j]
        newArray[j] = temp
    }
    return newArray
}

export function getConnectedPlayers(room: Room) {
    return Object.values(room.players).filter(
        (player) => player.status === PlayerStatus.CONNECTED
    )
}
