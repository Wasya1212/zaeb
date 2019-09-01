const Router = require('koa-router');
const mongoose = require('mongoose');

const UserModel = require('../../models/user');

const router = new Router();

router.post('/api/users', async ctx => {
  const users = await UserModel.find({ ['info.name']: { $regex: "wasya", $options: 'i' } });

  console.log('hui', users);

  ctx.body = users;
});

module.exports = router;
