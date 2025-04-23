import { Button } from './ui/button'
import socket from '../socket.ts'
import { useSelector } from 'react-redux'
export const EndGameButton = () => {
    const { roomId } = useSelector((state) => state.feState)
    function endGame() {
        socket.emit('end-game', { roomId })
    }
    return (
        <Button className="m-4" onClick={endGame}>
            End Game
        </Button>
    )
}
