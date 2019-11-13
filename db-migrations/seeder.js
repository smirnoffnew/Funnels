var Profile = require('../BackEnd/src/models/profile');
var Funnel = require('../BackEnd/src/models/funnel');
var mongoose = require('mongoose');

var mongoOptions = {
    useUnifiedTopology: true,
    keepAlive: 1,
    connectTimeoutMS: 30000,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 5000,
    useNewUrlParser: true
};

mongoose.connect('mongodb://209.182.217.162:27018/Funnelsmap', mongoOptions, function (err) {
    
    if (err) throw err;

    console.log('Successfully connected');

    Promise.all([
            Profile.find({
                photoUrl: /^\/public.*$/
            }).exec(),
            Funnel.find({
                funnelBackground: /^\/public.*$/
            }).exec()
        ])
        .then(async (values) => {
            try {
                const resp1 = Promise.all(

                    values[0].map(obj => Profile.findOneAndUpdate({
                            _id: obj._id
                        }, {
                            photoUrl: `45.61.48.153${obj.photoUrl.slice(7)}`
                        }, {
                            new: true,
                            useFindAndModify: false
                        })
                        .exec()
                    )
                );
                const resp2 = await Promise.all(

                    values[1].map(obj => Funnel.findOneAndUpdate({
                            _id: obj._id
                        }, {
                            funnelBackground: `45.61.48.153${obj.funnelBackground.slice(7)}`
                        }, {
                            new: true,
                            useFindAndModify: false
                        })
                        .exec()
                    )
                );
                await console.log('Profile ', resp1.length);
                await console.log('Funnel ', resp2.length);
                await mongoose.disconnect();
            } catch (e) {
                console.log(e)
            }
        })
});