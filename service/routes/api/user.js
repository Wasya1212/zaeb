const Router = require('koa-router');
const mongoose = require('mongoose');

const UserModel = require('../../models/user');

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
  console.log(ctx.request.body);
  console.log(ctx.request.files)
  ctx.body = ctx.request.body;
});

module.exports = router;
