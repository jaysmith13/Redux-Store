const mongoose = require('mongoose');

mongoose.connect(process.env.mongodb_uri || 'mongodb://localhost/mernshopping', {
    useNewUrlParser: true,
    useUniffiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

module.exports = mongoose.connection;