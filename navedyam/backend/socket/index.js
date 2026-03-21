const { Server } = require('socket.io');

/**
 * Initialise Socket.IO on the given HTTP server.
 * @param {import('http').Server} server
 * @returns {import('socket.io').Server} io instance
 */
function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    // Join a room scoped to a specific order
    socket.on('join:order', (orderId) => {
      socket.join(`order:${orderId}`);
    });

    // Leave an order-specific room
    socket.on('leave:order', (orderId) => {
      socket.leave(`order:${orderId}`);
    });

    // Join the shared kitchen room
    socket.on('join:kitchen', () => {
      socket.join('kitchen');
    });
  });

  return io;
}

module.exports = initSocket;
