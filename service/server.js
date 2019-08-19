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
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

mongoose
  .connect('mongodb://localhost:27017/test', { useNewUrlParser: true })
  .then(() => console.log("MongoDb connected..."))
  .catch(err => console.error(err));

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email!',
      isAsync: false
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 6;
      },
      message: '{VALUE} need length > 5 symbols!'
    },
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  online: {
    type: Boolean,
    required: true,
    default: false
  },
  info: {
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function(phone_number) {
          return /^((\+|38|0)+([0-9]){9})$/m.test(phone_number);
        },
        message: '{VALUE} is not a valid phone number!'
      }
    },
    name: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      required: false
    },
    salary: {
      type: Number,
      required: true,
      validate: {
        validator: function(v) {
          return v >= 0;
        },
        message: 'Salary cannot be < 0!'
      }
    },
    post: {
      type: String,
      required: true
    },
    chats: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    status: {
      weeks: [{
        updated: Date,
        working_hours: {
          type: Number,
          required: false,
          validate: {
            validator: function(v) {
              return v >= 0;
            },
            message: 'Working hours cannot be < 0!'
          }
        },
        vacation_hours: {
          type: Number,
          required: false,
          validate: {
            validator: function(v) {
              return v >= 0;
            },
            message: 'Working hours cannot be < 0!'
          }
        },
        truancy_hours: {
          type: Number,
          required: false,
          validate: {
            validator: function(v) {
              return v >= 0;
            },
            message: 'Working hours cannot be < 0!'
          }
        },
        holiday_hours: {
          type: Number,
          required: false,
          validate: {
            validator: function(v) {
              return v >= 0;
            },
            message: 'Working hours cannot be < 0!'
          }
        }
      }],
      work_days: [{
        type: Number,
        validate: {
          validator: function(v) {
            return (v >= 1 && v <= 7 )
          },
          message: 'Day has been selected only between 1 and 7!'
        }
      }],
      work_times: [{
        start: {
          type: String,
          required: true,
          validate: {
            validator: function(time) {
              return /^(?:[01]\d|2[0123]):(?:[012345]\d)$/m.test(time);
            },
            message: '{VALUE} is wrong time format!'
          }
        },
        end: {
          type: String,
          required: true,
          validate: {
            validator: function(time) {
              return /^(?:[01]\d|2[0123]):(?:[012345]\d)$/m.test(time);
            },
            message: '{VALUE} is wrong time format!'
          }
        }
      }]
    }
  },
}, { timestamps: true });

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {return next()};
    bcrypt.hash(user.password,10).then((hashedPassword) => {
        user.password = hashedPassword;
        next();
    })
}, function (err) {
    next(err)
})

UserSchema.methods.comparePassword = function(candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return next(err);
    next(null, isMatch)
  });
}

const User = mongoose.model("User", UserSchema);

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
  try {
    const token = ctx.headers.authorization.split(" ")[1]
    jwt.verify(token, key.tokenKey, function (err, payload) {
      console.log(payload)
      if (payload) {
          user.findById(payload.userId).then(
              (doc)=>{
                  req.user = doc;
                  next()
              }
          )
      } else {
         next()
      }
    })
  } catch(e) {
      next()
  }
});

router.get('/', async (ctx, next) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream(path.resolve(__dirname, 'public/index.html'));
  await next();
});

router.post('/login', async (ctx, next) => {
  const user = await User.findOne({ email: ctx.request.body.email }, (err, user) => user);

  if (!user) {
    ctx.throw(404, "User not found");
  }

  const isMatch = bcrypt.compareSync(ctx.request.body.password, user.password);

  if (isMatch) {
    ctx.body = user;
  } else {
    ctx.throw(403, "Wrong password!");
  }

  await next();
});

router.post('/sign-up', async (ctx, next) => {
  console.log(ctx.request.body)
  const user = new User({
    username: ctx.request.body.username,
    email: ctx.request.body.email,
    password: ctx.request.body.password
  });

  // await createUser(user)
  //   .then(newUser => {
  //     console.log(newUser);
  //     ctx.body = { user: newUser };
  //   });

  user.save();

  await next();
});

router.post('/api/auth/signin', (ctx, next) => {
  user.findOne({ email: ctx.request.body.email }).then(user => {
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
