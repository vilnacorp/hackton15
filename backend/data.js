var mongoose = require('mongoose');
var schemas = require('./schemas');
var UserModel = schemas.UserModel;
mongoose.connect('mongodb://localhost/test');

exports.validateLogin = function (obj, handler) {

    schemas.UserModel.find({'username': obj.userName}, function (err, user) {

        if (!err) {

            handler(loginStatus.ERROR.NO_USER);

        } else {

            if (user.password === obj.password) {

                if (user.admin) {

                    handler(loginStatus.ADMIN);

                } else {

                    handler(loginStatus.USER);

                }

            } else {

                handler(loginStatus.BAD_PASSWORD);

            }
        }
    });

};

exports.register = function (obj, handler) {

    var user = new UserModel(obj);

    user.save(function (err) {
        if (err) {
            handler(registerStatus.ERROR);
        } else {
            handler(registerStatus.OK);
        }
    })
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

var registerStatus = {
    ERROR: 1,
    OK: 0
};

exports.registerStatus = registerStatus;