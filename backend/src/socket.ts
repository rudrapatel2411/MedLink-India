// MedLink India — Real-Time Socket.io Server Engine
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`⚡ [Socket.io] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`🔌 [Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  console.log('🚀 [Socket.io] Real-time WebSocket Notification Engine initialized');
  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

export const emitNotification = (event: string, payload: any) => {
  if (io) {
    console.log(`📢 [Socket.io Emit] Event: "${event}"`, payload);
    io.emit(event, {
      timestamp: new Date().toISOString(),
      ...payload,
    });
  }
};
