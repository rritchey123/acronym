import { io } from 'socket.io-client'

const port = 3030
// "undefined" means the URL will be computed from the `window.location` object
const URL =
    process.env.NODE_ENV === 'production'
        ? undefined
        : `http://localhost:${port}`

console.log('before')
const socket = io(URL, { autoConnect: true })
console.log('after')

socket.on('connect', function () {
    console.log('Front end connected to backend!')
})

socket.on('room-created', (payload) => {
    console.log('ROOM CREATED! ', payload)
})
export default socket
