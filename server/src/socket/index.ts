import http from 'http'
import { Server } from 'socket.io'
import app from '../app'

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST']
    }
})

const userSocketMap: { [key: string]: string } = {} // {userId: socketId}
export const getReceiverSocketId = (receiverId: string): string | undefined => {
    return userSocketMap[receiverId]
}

io.on('connection', (socket) => {
    console.log('a user connected', socket.id)

    const userId = socket.handshake.query.userId as string
    const socketId = socket.id
    if (userId != 'undefined') userSocketMap[userId] = socketId

    // io.emit() is used to send events to all the connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    // socket.on() is used to listen to the events. can be used both on client and server side
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id)
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})

export { io, server }
