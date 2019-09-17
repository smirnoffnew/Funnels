const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET, (err, authData) => {
        if (err) {
            return res.status(403).send("No authority");
        }
        req.authData = authData;
        next();
    });
};