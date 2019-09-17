module.exports = function(req, res, next) {
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next();
};
