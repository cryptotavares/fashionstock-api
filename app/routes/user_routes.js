var fs = require('fs');
var User = require('../models/users');
var hashpwd = require('../hash');

module.exports = function(router, serverlog){

var createUser = function(req, res, user, iscreate){
    var messageLog = '';
    user.name = req.body.name;
    user.email = req.body.email;
    if(iscreate){
        messageLog = `User ${user.name} created!\n`;
        user.created_on = new Date();
        user.lastUpdate = supplier.created_on;
    } else {
        messageLog = `User ${user.name} updated!\n`;
        user.lastUpdate = new Date();
    }
    user.save((err) => {
        if(err){
            res.json({
                success: false,
                error: err
            });
            fs.appendFile(serverlog,`${err}\n`);
        } else {
            fs.appendFile(serverlog, messageLog);
            res.status(200).json({
                success: true,
                message: messageLog
            });
        }
    });
};

router.route('/user')
    .get((req, res) => {
        User.find().where('_id').in(req.decoded._doc._id).exec((err, users) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                fs.appendFile(serverlog,`${users}\n`);
                res.status(200).json({
                    success: true,
                    results: users
                });
            }
        });
    })
    .delete((req, res) => {
        User.remove({
            _id: req.decoded._doc._id
        }, (err, user) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Successfully deleted!'
                });
                fs.appendFile(serverlog,`User successfully deleted!`);
            }
        });
    });

router.route('/user/:user_id')
    .put((req, res) => {
        var iscreate = false;
        if(req.decoded._doc._id != req.params.user_id){
            res.status(401).json({
                success: false,
                message: `Not authorized to update user ${req.params.user_id}.`
            });
            fs.appendFile(serverlog, `Not authorized to update user ${req.params.user_id}.\n`);
            return;
        }
        User.findById(req.params.user_id, (err, user) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog, `${err}\n`);
                return;
            }
            if(!user){
                res.status(404).json({
                    success: false,
                    message: 'User not found.'
                });
                fs.appendFile(serverlog,`User ${user} not found!\n`);
                return;
            }
            createUser(req, res, user, iscreate);
        });
    });

router.route('/user/:user_id/reset')
    .put((req, res) => {
        var iscreate = false;
        if(req.decoded._doc._id != req.params.user_id){
            res.status(401).json({
                success: false,
                message: `Not authorized to update user ${req.params.user_id}.`
            });
            fs.appendFile(serverlog, `Not authorized to update user ${req.params.user_id}.\n`);
            return;
        }
        User.findById(req.params.user_id, (err, user) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog, `${err}\n`);
                return;
            }
            if(!user){
                res.status(404).json({
                    success: false,
                    message: 'User not found.'
                });
                fs.appendFile(serverlog,`User ${user} not found!\n`);
                return;
            }
            var passwordData = hashpwd.sha512(req.body.old_password, user.salt);
            if(user.password != passwordData.passwordHash){
                res.status(404).json({
                    success: false,
                    message: 'Wrong password!'
                });
                fs.appendFile(serverlog,`Wrong password!\n`);
                return;
            }
            var salt = hashpwd.genRandomString(16);
            var newPassword = hashpwd.sha512(req.body.new_password, salt);
            user.password = newPassword.passwordHash;
            user.salt = newPassword.salt;
            user.save((err) => {
                if(err){
                    res.status(500).json({
                        success: false,
                        error: err
                    });
                    fs.appendFile(serverlog, `${err}\n`);
                    return;
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Password changed successfully!\n',
                    });
                    fs.appendFile(serverlog, `Password changed successfully!\n`);
                }
            });
        });
    });
};