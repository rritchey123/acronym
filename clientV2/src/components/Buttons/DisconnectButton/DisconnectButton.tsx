import socket from '../../../socket.ts'

export function DisconnectButton() {
    function disconnect() {
        socket.disconnect()
    }

    return <button onClick={disconnect}>Disconnect</button>
}
