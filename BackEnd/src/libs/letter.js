module.exports = function (name, token) {
    let Url = (process.env.NODE_ENV === 'dev' ? process.env.DEV_URL : process.env.PROD_URL);
    return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
</head>

<body>
    <div">
        <p>Greetings <span style="color: red">${name}</span>!</p>
        <p>To confirm password changing,please,follow this link</p>
        <p><a href="${Url}/password-forgot-step-3/?token=${token}" style="color: blue">Confirm change</a></p>
        </div>
</body>

</html>`
};