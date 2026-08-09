// MedLink India — Server Entry Point with Socket.io Real-Time Engine
import http from 'http';
import app from './app';
import prisma from './config/database';
import { initSocket } from './socket';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Create HTTP server & bind Socket.io Engine
    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🏥  MedLink India — Healthcare OS Backend                ║
║                                                            ║
║   ✅ Server:    http://localhost:${PORT}                   ║
║   ✅ Health:    http://localhost:${PORT}/api/v1/health      ║
║   ✅ Socket.io: Enabled (http://localhost:${PORT})           ║
║   ✅ Env:       ${process.env.NODE_ENV || 'development'}                            ║
║   ✅ Database:  Connected (SQLite/Prisma)                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
