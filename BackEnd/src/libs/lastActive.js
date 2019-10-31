const AC = require('activecampaign-rest');

module.exports = function (req, res, next){

    let today = new Date();
    let date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear()

    let contact = new AC.Contact({
        'url': 'https://vladhuntyk.activehosted.com',
        'token': process.env.CAMPAING_ACCOUNT_KEY
    })

    let payload = {
        'email': req.authData.profile.email,
        'firstName': req.authData.profile.firstName,
        'lastName': req.authData.profile.lastName,
        'phone': req.authData.profile.phone,
        'fields': [
            {
                'name': 'Last Active',
                'value': date
            },
        ]
    }

    contact.sync(payload, (err, res) => {
            if (err) {
                console.log("error", err)
            }
    });

    next();

}