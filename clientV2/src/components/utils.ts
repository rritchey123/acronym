import { PlayerStatus, Room } from '@shared/index'

export function getConnectedPlayers(room: Room) {
    return Object.values(room.players).filter(
        (player) => player.status === PlayerStatus.CONNECTED
    )
}
