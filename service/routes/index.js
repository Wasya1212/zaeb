const Router = require('koa-router');

const authRouter = require('./api/auth');
const userRouter = new Router();

userRouter.get('/', async (ctx, next) => {
  ctx.type = 'html';
  // ctx.body = fs.createReadStream(path.resolve(__dirname, 'public/index.html'));
  await next();
});

userRouter.get('/login', async (ctx, next) => {
  ctx.body = 'login';
  await next();
});

module.exports = { userRouter, authRouter };
