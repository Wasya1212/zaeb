"use strict";

const path = require('path');
const fs = require('fs');

const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const cors = require('@koa/cors');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserModel = require('./models/user');

mongoose
  .connect('mongodb://wasya1212:wasya1212@ds042677.mlab.com:42677/practic', { useNewUrlParser: true })
  .then(() => console.log("MongoDb connected..."))
  .catch(err => console.error(err));



// const createUser = newUser => {
//   console.log(newUser)
//   return new Promise((resolve, reject) => {
//     if (newUser.password.length < 6) {
//       reject(new Error("Password must be 6 or more characters!"));
//     }
//
//     bcrypt.genSalt(10, (err, salt) => {
//       bcrypt.hash(newUser.password, salt, function(err, hash) {
//         newUser.password = hash;
//         resolve(newUser.save());
//       });
//     });
//   });
// }

const app = new Koa();
const router = new Router();

const PORT = process.env.PORT || 5000;

let activeUsers = {};

router.all('/', async (ctx, next) => {
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

router.get('/', async (ctx, next) => {
  ctx.type = 'html';
  // ctx.body = fs.createReadStream(path.resolve(__dirname, 'public/index.html'));
  await next();
});

router.get('/login', async (ctx, next) => {
  ctx.body = 'login';
  await next();
});

router.post('/api/auth/login', async (ctx, next) => {
  const user = await UserModel.findOne({ email: ctx.request.body.email }, (err, user) => user);

  if (!user) {
    ctx.throw(404, "User not found");
  }

  const isMatch = bcrypt.compareSync(ctx.request.body.password, user.password);

  if (isMatch) {
    ctx.body = jwt.sign({ id: user._id }, 'secret', { algorithm: 'HS512',  expiresIn: '1h' });
  } else {
    ctx.throw(403, "Wrong password!");
  }

  await next();
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

router.post('/api/auth/signin', (ctx, next) => {
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
})

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {code: err.statusCode, message: err.message};
    ctx.app.emit('error', err, ctx);
  }
})

app.on('error', (err, ctx) => {
  console.error(err);
});

app.use(cors());
app.use(serve(path.resolve(__dirname, 'public')));
app.use(koaBody({
   multipart: true,
   urlencoded: true
}));
app.use(router.routes());

app.listen(PORT, () => {
  console.log(`Server work on port ${PORT}...`);
});
