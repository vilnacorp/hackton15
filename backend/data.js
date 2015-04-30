var mongoose = require('mongoose');
var schemas = require('./schemas');
mongoose.connect('mongodb://localhost/test');

exports.validateLogin = function (username, password) {

    schemas.UserModel.find({"userName": username}, function (err, user) {
        if (!err) {
            return loginStatus.ERROR.NO_USER;
        } else {

            if (user.password === password) {

                if (user.admin) {

                    return loginStatus.ADMIN;

                } else {

                    return loginStatus.USER;

                }

            } else {

                return loginStatus.BAD_PASSWORD;

            }
        }
    });

};

var loginStatus = {
    ADMIN: 0,
    USER: 1,
    ERROR: {
        NO_USER: 0,
        BAD_PASSWORD: 1
    }
};

exports.loginStatus = loginStatus;