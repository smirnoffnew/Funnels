const rateLimit = require("express-rate-limit");

const requestLimiter = rateLimit({
    windowMs:  2 * 1000,
    max: 1,
    message: "Too many requests"
});

module.exports = requestLimiter;