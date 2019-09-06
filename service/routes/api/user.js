const Router = require('koa-router');
const mongoose = require('mongoose');
const fs = require('fs');

const UserModel = require('../../models/user');

const upload = require('../../middleware/upload');

const router = new Router();

router.post('/api/users', async ctx => {
  const users = await UserModel.find({ ['info.name']: { $regex: ctx.request.body.name || "", $options: 'i' } });
  ctx.body = users;
});

router.post('/api/user', async ctx => {
  const user = await UserModel.findOne(ctx.request.body.user || {});
  ctx.body = user;
});

router.post('/api/user/current-user', async ctx => {
  console.log(ctx.state.user)
  ctx.body = ctx.state.user;
});

router.post('/api/user/edit', async ctx => {
  let uploadedAvatar;

  try {
    uploadedAvatar = await upload(ctx.request.files.file.path.toString());
    fs.unlinkSync(ctx.request.files.file.path.toString());
  } catch (e) {
    uploadedAvatar = { secure_url: ctx.request.body.avatarImage || '' }
  } finally {
    console.log(JSON.parse(ctx.request.body.workDays));
  }

  const updatedUser = await UserModel.findByIdAndUpdate(ctx.state.userId, {
    $set: {
      info: {
        name: ctx.state.user.info.name,
        chats: ctx.state.user.info.chats,
        phone: ctx.request.body.phone,
        photo: uploadedAvatar.secure_url,
        salary: ctx.request.body.salary,
        post: ctx.request.body.post,
        status: {
          work_times: [{
            start: ctx.request.body.startWorkTime,
            end: ctx.request.body.endWorkTime
          }],
          work_days: JSON.parse(ctx.request.body.workDays).map(num => Number(num))
        }
      }
    }
  }, { upsert: true, new: true });

  ctx.body = updatedUser;
});

module.exports = router;
