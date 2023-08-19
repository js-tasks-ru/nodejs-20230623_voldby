const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');
const mongoose = require("mongoose");

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {

    //console.log(socket.handshake.query);
    if (!socket.handshake.query.token)
      return next(new Error("anonymous sessions are not allowed"));
    else {
      let session = await Session.findOne({token: socket.handshake.query.token}).exec();
      if (!session)
        return next(new Error("wrong or expired session token"));
      else {
        await session.populate('user');
        socket.user = session.user;
      }
    }

    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      await Message.create({
        user: socket.user.displayName,
        chat: new mongoose.Types.ObjectId(socket.user.id),
        text: msg,
        date: new Date()
      });
    });
  });

  return io;
}

module.exports = socket;
