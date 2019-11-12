var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.headers['x-access-token'];
  if (typeof token !== 'undefined') {
    jwt.verify(token, 'secretkey', function(err, decoded) {
      err ? res.sendStatus(403) : next();
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};
