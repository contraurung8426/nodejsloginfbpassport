const mongoose = require('mongoose');

const UserFbSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String
    },
    facebookID: {
        type: String,
    },
    accessToken: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const FbUser = mongoose.model('FbUser', UserFbSchema);

module.exports = FbUser;