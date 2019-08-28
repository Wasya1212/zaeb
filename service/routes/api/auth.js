const Router = require('koa-router');
const jwt = require('jsonwebtoken');

const UserModel = require('../../models/user');

const router = new Router();

router.post('/api/auth/sign-up', async ctx => {
  const user = new UserModel({
    ['info.name']: ctx.request.body.username,
    email: ctx.request.body.email,
    password: ctx.request.body.password
  });

  await user
    .save()
    .catch(err => {
      ctx.throw(403, "Cannot create user or user is already created!");
    });

  ctx.body = user;
  await next();
});

router.post('/api/auth/sign-in', async ctx => {
  const user = await UserModel.findOne({ email: ctx.request.body.email }, (err, user) => user);

  if (!user) {
    ctx.throw(404, "User not found");
  }

  const isMatch = user.comparePassword(ctx.request.body.password, user.password);

  if (isMatch) {
    const token = jwt.sign({ id: user._id }, 'secret', { algorithm: 'HS512',  expiresIn: '1h' });
    ctx.body = token;
  } else {
    ctx.throw(403, "Wrong password!");
  }
});

router.post('/api/auth/logout', async ctx => {
  ctx.state.isAuthenticated = false;
  ctx.state.userId = null;
  ctx.res.statusCode = 200;
  ctx.res.end();
  console.log('logout');
});

router.post('/api/auth/authorization', async (ctx, next) => {
  console.log(`Authentication user...`);
  await next();
});

module.exports = router;
