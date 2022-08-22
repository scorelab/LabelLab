import openSocket from 'socket.io-client'

const URL = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_SERVER_PORT}`

const socket = openSocket(URL, { transports: ['polling'] })

export default socket
