let io = require('socket.io')

module.exports = (http) => {
    io = io(http)

    io.on('connection',(socket) => {
        console.log('a user connected')


        socket.on('chat message', (msg, callback) => {
            console.log('message: ', msg);
            let time = new Date();
            socket.broadcast.emit('client message', {msg, time})
            callback({msg, time})
        })

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}