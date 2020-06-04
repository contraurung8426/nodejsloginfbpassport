const mongoose = require('mongoose');

const UserFbSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    facebookID: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const FbUser = mongoose.model('FbUser', UserFbSchema);

module.exports = FbUser;