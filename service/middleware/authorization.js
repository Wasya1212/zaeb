const jwt = require('jsonwebtoken');

const SECRET = 'secret';

function verifyToken(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

const withAuth = async (ctx, next) => {
  let token;

  try {
    token = ctx.request.body.token || ctx.request.query.token || ctx.headers.authorization.split("")[0];
  } catch (e) {
    ctx.throw(401, "Unauthorized: No token provided!");
  }

  try {
    const decoded = await verifyToken(token, SECRET);
    ctx.userId = decoded.id;
  } catch (e) {
    ctx.throw(401, "Unauthorized: Invalid token!");
  } finally {
    await next();
  }
};

module.exports = withAuth;
