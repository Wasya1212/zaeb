const Router = require('koa-router');
const mongoose = require('mongoose');

const ChatModel = require('../../models/chat');
const UserModel = require('../../models/user');
const MessageModel = require('../../models/message');

const router = new Router();

router.post('/api/chat/chat-rooms', async ctx => {
  await ChatModel
    .find({ _id: { $in: (ctx.state.user.info.chats || []).map(mongoose.Types.ObjectId) } })
    .then(chats => {
      ctx.body = chats;
    })
    .catch(err => {
      console.log(err.statusCode, err.code);
      ctx.throw(err.code, err.message);
    })
});

router.post('/api/chat/conversation', async ctx => {
  await ChatModel
    .findOne({private: true, users: { $all: [ctx.state.userId, ctx.request.body.interlocutorId] }})
    .then(chat => {
      ctx.body = chat;
    })
    .catch(err => {
      console.error(err)
      ctx.throw(404, "Cannot find chat room!");
    })
});

router.post('/api/chat/create', async ctx => {
  const chat = new ChatModel({
    name: ctx.request.body.name || 'chat #' + Date.now(),
    private: ctx.request.body.private || true,
    users: [ ctx.state.userId, ctx.request.body.interlocutorId ]
  });

  let user;

  try {
    await chat.save();
    user = await UserModel.findByIdAndUpdate(ctx.state.userId, { $push: { ['info.chats']: chat._id } });
  } catch (e) {
    console.log(e);
    ctx.throw(403, "Cannot create chat!");
  } finally {
    ctx.body = chat;
  }
});

router.post('/api/chat/message', async ctx => {
  const conversation = await ChatModel.findOne({private: true, users: { $all: [ctx.state.userId, ctx.request.body.interlocutorId] }});

  if (!conversation) {
    const chat = new ChatModel({
      name: 'conversation',
      private: true,
      users: [ ctx.state.userId, ctx.request.body.interlocutorId ]
    });

    const message = new MessageModel({
      author: ctx.state.userId,
      chat: chat._id,
      text: ctx.request.body.message
    });

    try {
      await chat.save();
      await message.save();

      await ChatModel.updateOne({_id: chat._id}, {$push: {messages: message._id}});
      await UserModel
        .where({_id: {
          $in: ([ctx.state.userId, ctx.request.body.interlocutorId]).map(mongoose.Types.ObjectId)}
        })
        .updateMany({ $push: { ['info.chats']: chat._id } }, { multi: true });

      ctx.body = message;
    } catch (e) {
      console.log(e);
      ctx.throw(403, "Cannot create message!");
    }
  } else {

  }
});

module.exports = router;
