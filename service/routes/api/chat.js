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
      console.log([ctx.state.userId, ctx.request.body.interlocutorId])
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
  let conversation;

  if (!ctx.request.body.chatId && !ctx.request.body.interlocutorId) {
    ctx.throw(401, "No message data found!");
  }

  try {
    const chat = await ChatModel.findById(ctx.request.body.chatId);

    if (!chat || chat == {}) {
      conversation = await ChatModel.findOne({private: true, users: {$all: [ctx.state.userId, ctx.request.body.interlocutorId]}});
    } else {
      conversation = chat;
    }
  } catch (e) {
    ctx.throw(e);
  }

  console.log(conversation);

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
      await UserModel.updateMany({
        _id: {
          $in: ([ctx.state.userId, ctx.request.body.interlocutorId]).map(mongoose.Types.ObjectId)
        }
      }, {
        $push: { ['info.chats']: chat._id }
      });

      ctx.body = message;
    } catch (e) {
      console.log(e);
      ctx.throw(403, "Cannot create message!");
    }
  } else {
    try {
      const message = new MessageModel({
        author: ctx.state.userId,
        chat: conversation._id,
        text: ctx.request.body.message
      });

      await message.save();
      await conversation.updateOne({$push: {messages: message._id}});

      ctx.body = message;
    } catch (e) {
      console.log(e)
      ctx.throw(403, "Cannot create message!");
    }
  }
});

router.post('/api/chat/messages', async ctx => {
  try {
    const chat =  await ChatModel.findById(ctx.request.body.chatId);
    const users = await UserModel.find({ _id: { $in: chat.users } });

    let messages = await MessageModel.find({ _id: { $in: chat.messages } });

    messages = messages.map(message => {
      return Object.assign({}, {
        author: users.find(user => user._id.toString() == message.author.toString()),
        chat: chat,
        text: message.text,
        createdAt: message.createdAt
      });
    });

    ctx.body = messages;
  } catch (e) {
    console.log(e);
    ctx.throw(403, "Cannot find messages!");
  }
});

router.post('/api/chat/discussion', async ctx => {
  const chat = await ChatModel.findById(ctx.request.body.chatId);

  ctx.body = chat;
});

module.exports = router;
