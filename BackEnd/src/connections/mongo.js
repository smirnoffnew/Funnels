const mongoose = require('mongoose');

//in url host == name of mongoDB container;
const options = {
    useNewUrlParser: true,
    useFindAndModify: true,
    autoReconnect: true,
    useUnifiedTopology: true,
    //useCreateIndex: true
};
module.exports = function () {
    mongoose
        .connect(process.env.DB_CONN,
           options,
            (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Database connected successfully!');
            });
};


