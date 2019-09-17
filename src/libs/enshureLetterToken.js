module.exports = (req, res, next) => {
    const letterHeader = req.headers['letter-confirm'];
    if (typeof letterHeader !== 'undefined') {
        req.token = letterHeader;
        next();
    } else {
        res.status(403).json({message: "invalid token", data: letterHeader});
    }
};