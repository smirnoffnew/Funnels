const validate = require('mongoose-validator');
const extend = require('mongoose-validator').extend

extend(
    'isString',
    function(val) {
        return Object.prototype.toString.call(val) === '[object String]'
    },
    'Not a string'
)
let alphaValidator = validate({
    validator: 'isString',
    passIfEmpty: true,
    message: 'firstName should contain alpha-numeric characters only',
    httpStatus: 400,
});

let nameValidator = validate({
    validator: 'isLength',
    arguments: [2, 25],
    message: 'firstName should be between {ARGS[0]} and {ARGS[1]} characters',
    httpStatus: 400,
});
let passwordValidator = validate({
    validator: 'isLength',
    arguments: [8, 25],
    message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters',
    httpStatus: 400,
});
let emailValidator = validate({
    validator: 'matches',
    arguments: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: 'Enter correct email',
    httpStatus: 400,
})
module.exports = {
    alphaValidator: alphaValidator,
    nameValidator: nameValidator,
    emailValidator: emailValidator,
    passwordValidator: passwordValidator,
};
