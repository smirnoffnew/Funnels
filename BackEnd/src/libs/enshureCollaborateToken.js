module.exports = (req, res, next) => {
    const collaborateHeader = req.headers['collaborate-confirm'];
    if (typeof collaborateHeader !== 'undefined') {
        req.collaborate_confirm = collaborateHeader;
        next();
    } else {
        res.status(403).json({message: "invalid collaborate token", data: collaborateHeader});
    }
};