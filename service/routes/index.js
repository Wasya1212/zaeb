const Router = require('koa-router');
const fs = require('fs');

const withAuth = require('../middleware/authorization');

const UserModel = require('../models/user');

const authRouter = require('./api/auth');
const userRouter = new Router();

const getPage = page => {
  try {
    return fs.createReadStream(path.resolve(__dirname, `public/${page}.html`));
  } catch (e) {
    return 'Page not found!';
  }
}

userRouter.get('/login', async (ctx, next) => {
  ctx.type = 'html';
  ctx.body = getPage('index');

  await next();
});

userRouter.get('/sign-up', async (ctx, next) => {
  ctx.type = 'html';
  ctx.body = getPage('index');

  await next();
});

userRouter.all('/*', withAuth, async (ctx, next) => {
  if (ctx.state.isAuthenticated) {
    try {
      ctx.state.user = await UserModel.findById(ctx.state.userId);
      ctx.body = 200;
    } catch (e) {
      ctx.throw(404, "Cannot find user!");
    } finally {
      await next();
    }
  } else {
    ctx.throw(401, "Unauthorized: Non authenticated!");
  }
});

userRouter.get('/', async (ctx, next) => {
  ctx.type = 'html';
  ctx.body = getPage('index');

  await next();
});

module.exports = { userRouter, authRouter };
