const Router = require('koa-router');
const mongoose = require('mongoose');

const ChatModel = require('../../models/chat');
const UserModel = require('../../models/user');

const router = new Router();

router.post('/api/chat/chat-rooms', async ctx => {
  await ChatModel
    .find({ _id: { $in: (ctx.state.user.info.chats || []).map(mongoose.Types.ObjectId) } })
    .then(chats => {
      console.log(chats);
      ctx.body = chats;
    })
    .catch(err => {
      console.log(err.statusCode, err.code);
      ctx.throw(err.code, err.message);
    })
});

router.post('/api/chat/create', async ctx => {
  const chat = new ChatModel({
    name: ctx.request.body.name || 'chat #' + Date.now(),
    private: ctx.request.body.private || true,
    users: [ ctx.state.userId ]
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

module.exports = router;
