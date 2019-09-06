const Router = require('koa-router');
const fs = require('fs');

const withAuth = require('../middleware/authorization');

const UserModel = require('../models/user');

const authRouter = require('./api/auth');
const chatRouter = require('./api/chat');
const userRouter = require('./api/user');

const router = new Router();

const getPage = page => {
  try {
    return fs.createReadStream(path.resolve(__dirname, `public/${page}.html`));
  } catch (e) {
    return 'Page not found!';
  }
}

router.get('/login', async (ctx, next) => {
  ctx.type = 'html';
  ctx.body = getPage('index');

  await next();
});

router.get('/sign-up', async (ctx, next) => {
  ctx.type = 'html';
  ctx.body = getPage('index');

  await next();
});

router.get('/api/hostname', async ctx => {
  ctx.body = ctx.host;
});

router.all('/*', withAuth, async (ctx, next) => {
  if (ctx.state.isAuthenticated) {
    try {
      ctx.state.user = await UserModel.findById(ctx.state.userId);

      if (ctx.request.url == '/api/auth/authorization' || ctx.request.url == '/api/auth/sign-in' || ctx.request.url == '/api/auth/sign-up') {
        ctx.body = 200;
      }
    } catch (e) {
      ctx.throw(404, "Cannot find user!");
    } finally {
      await next();
    }
  } else {
    ctx.throw(401, "Unauthorized: Non authenticated!");
  }
});

router.get('/', async (ctx, next) => {
  ctx.type = 'html';
  ctx.body = getPage('index');

  await next();
});

module.exports = { router, authRouter, chatRouter, userRouter };
