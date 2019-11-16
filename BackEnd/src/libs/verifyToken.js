const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET, (err, authData) => {
        if (err) {
            return res.status(401).json({
                error: err.message
            })
        }
        req.authData = authData;
        next();
    });
};
