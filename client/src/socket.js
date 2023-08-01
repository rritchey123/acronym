import { io } from 'socket.io-client';

const port = 3030
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : `http://localhost:${port}`;

const socket = io(URL,{ autoConnect: false});


socket.on('connect', function () {
    console.log('Front end connected to backend!');
});
export default socket


