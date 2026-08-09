// MedLink India — Frontend Real-Time Socket.io Client
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('⚡ [Socket.io Client] Connected to real-time notification engine:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 [Socket.io Client] Disconnected from notification engine');
    });
  }
  return socket;
};
