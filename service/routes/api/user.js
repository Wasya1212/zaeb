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

module.exports = router;
