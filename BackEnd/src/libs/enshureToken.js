module.exports = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        req.token = bearer[1];
        next();
    } else {
        return res.status(403).json({message: "invalid token", data: bearerHeader});
    }
};
