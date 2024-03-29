let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    uid: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    }
}, {
    versionKey: false
});

const User = mongoose.model('User', userSchema);
module.exports = User;