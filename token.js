let jwt = require('jsonwebtoken');
const secret = 'secret string';

const Token = {
    encrypt: function (data, time) {
        return jwt.sign(data, secret, {
            expiresIn: time
        });
    },
    decrypt: function (token) {
        const data = jwt.verify(token,secret);
        return {
            token:true,
            data:data
          };
    }
};

module.exports = Token;
