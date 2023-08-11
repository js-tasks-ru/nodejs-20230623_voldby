const Message = require('../models/Message');
const MessageMap = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {

  let messages = await Message.find({chat: ctx.user.id}, null, { sort: { date: -1 }, limit: 20 }).exec();
  let res = [];
  if (messages) {
    for (const msg of messages) {
      res.push(MessageMap(msg));
    }

    ctx.body = {messages: res};
  }
  else {
    ctx.body = {};
  }
};
