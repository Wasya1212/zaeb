const Router = require('koa-router');
const jwt = require('jsonwebtoken');

const UserModel = require('../../models/user');

const withAuth = require('../../middleware/authorization');

const router = new Router();

router.post('/api/auth/login', async ctx => {
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

router.all('/*', withAuth, ctx => {
  console.log(ctx.userId)
  ctx.body = ctx.userId;
});

router.post('/api/authenticate', async (ctx, next) => {
  console.log(ctx.headers.authorization.split(" ")[0]);
  ctx.redirect('/login');
  next();
  // try {
  //   const token = ctx.headers.authorization.split(" ")[1]
  //   console.log(token)
  //   jwt.verify(token, key.tokenKey, function (err, payload) {
  //     console.log(payload)
  //     if (payload) {
  //         UserModel.findById(payload.userId).then(
  //             doc => {
  //                 req.user = doc;
  //                 next()
  //             }
  //         )
  //     } else {
  //        next()
  //     }
  //   })
  // } catch(e) {
  //     next()
  // }
});

router.post('/api/auth/sign-up', async (ctx, next) => {
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

router.post('/api/auth/sign-in', (ctx, next) => {
  UserModel.findOne({ email: ctx.request.body.email }).then(user => {
    user.comparePassword(ctx.request.body.password, (err, isMatch) => {
      if(isMatch){
        var token = jwt.sign({ userId: user.id }, key.tokenKey);
        res.status(200).json({
          userId: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
          token
        });
      }
      else{
        ctx.throw(400, "Invalid Password/Username");
      }
    })
  }).catch((err)=>{
    ctx.throw(400, "Invalid Password/Username");
  });
});

module.exports = router;
