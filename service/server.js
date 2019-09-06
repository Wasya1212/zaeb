"use strict";

const path = require('path');
const fs = require('fs');
const http = require('http');

const Koa = require('koa');

const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const cors = require('@koa/cors');

const mongoose = require('./middleware/mongoose');
const errorhandler = require('./middleware/errorHandler');

const {
  router,
  userRouter,
  authRouter,
  chatRouter
} = require('./routes/index');

const app = new Koa();

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app.callback());

const io = require('socket.io')(httpServer);

io.on('connection', function(socket){
  socket.on('chat message', data => {
    console.log('message: ' + data.room);
    socket.to(data.room.toString()).emit('message', {message: data.message});
  });
  socket.on('join to room', room => {
    console.log('room', room);
    socket.join(room.chatId.toString());
  });
});

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(errorhandler());

app.on('error', (err, ctx) => {
  console.error(err);
});

app.use(cors());
app.use(serve(path.resolve(__dirname, 'public')));
app.use(koaBody({
  formidable: {
    uploadDir: './uploads',
    keepExtensions: true
  },
  multipart: true,
  urlencoded: true
}));

app.use(authRouter.routes(), authRouter.allowedMethods());
app.use(router.routes(), router.allowedMethods());
app.use(chatRouter.routes(), chatRouter.allowedMethods());
app.use(userRouter.routes(), userRouter.allowedMethods());

httpServer.listen(PORT, () => {
  console.log(`Server work on port ${PORT}...`);
});
