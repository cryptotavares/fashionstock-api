var fs = require('fs');
var User = require('../models/users');
var jwt = require('jsonwebtoken');
var config = require('../../constants');
var hashpwd = require('../hash');
var helper = require('sendgrid').mail;
var sg = require('sendgrid')(config.sendGrid_API);


module.exports = function(router, serverlog){
router.route('/signup')
    .post( (req, res) => {
        var user = new User();

        var salt = hashpwd.genRandomString(16);
        var passwordData = hashpwd.sha512(req.body.password, salt);

        user.name = req.body.name;
        user.password = passwordData.passwordHash;
        user.email = req.body.email;
        user.salt = passwordData.salt;
        user.admin = true;
        user.created_on = new Date();
        user.lastUpdate = user.created_on;

        user.save((err) => {
            if(err){
                res.json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog,`${err}\n`);
            } else {
                fs.appendFile(serverlog, `User ${user.name} created!\n`);
                res.status(200).json({
                    success: true,
                    message: `User ${user.name} created!`
                });
            }
        });
    });

router.route('/signin')
    .post( (req, res) => {
        User.findOne({email: req.body.email}, (err, user) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog,`${err}\n`);
                return;
            }
            if(!user){
                res.status(404).json({
                    success: false,
                    message: 'Authentication failed! User not found.'
                });
            } else if(user) {

                var passwordData = hashpwd.sha512(req.body.password, user.salt);

                if(user.password != passwordData.passwordHash){
                    res.status(404).json({
                        success: false,
                        message: 'Authentication failed! Wrong password.'
                    });
                } else {
                    var token =jwt.sign(user, config.jwtsecret, {
                        expiresIn: "30d"
                    });

                    user.token = token;
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
                                message: 'Enjoy your token',
                                token: token
                            });
                            fs.appendFile(serverlog, `Token ${token} created for user ${user.name}\n`);
                        }
                    });
                }
            }
        });
    });

router.route('/forgot')
    .post( (req, res) => {
        User.findOne({email: req.body.email}, (err, user) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: err
                });
                fs.appendFile(serverlog,`${err}\n`);
                return;
            }
            if(!user){
                fs.appendFile(serverlog, {success: false, message: 'Authentication failed! User not found.'});
                res.status(404).json({
                    success: false,
                    message: 'Authentication failed! User not found.'
                });
            } else if(user) {
                var token =jwt.sign(user, config.jwtsecretTemp, {
                    expiresIn: "2h"
                });
                //IMPLEMENT SEND EMAIL WITH LINK ATTACHED
                var resetUrl = `http://www.fashionstock/forgot/reset?t=${token}`;
                var resetMessage = `Someone recently requested that the password be reset for ${user.name}!\n \nThe below link will only be active during the next 2 hours!\n \n`;
                var fromEmail = new helper.Email('pwdrecovery@fashionstock.io');
                var toEmail = new helper.Email(user.email);
                var subject = `FashionStock Password Reset for ${user.name}`;
                var content = new helper.Content('text/plain', resetMessage + resetUrl);
                var mail = new helper.Mail(fromEmail, subject, toEmail, content);

                var request = sg.emptyRequest({
                    method: 'POST',
                    path: '/v3/mail/send',
                    body: mail.toJSON()
                });
                sg.API(request, function (err, response) {
                    if (err) {
                        console.log('Error response received');
                        res.send({success: false, message: 'Failed to send email'});
                        fs.appendFile(serverlog, {success: false, message: 'Failed to send email'});
                        return;
                    }
                    console.log('EMAIL:', response.statusCode);
                    console.log('EMAIL:', response.body);
                    console.log('EMAIL:', response.headers);
                    fs.appendFile(serverlog, `Password reset email sent for user ${user.name}!\n`);
                    res.status(200).json({
                        success: true,
                        message: `Password reset email sent for user ${user.name}!\n`,
                        tokenTemp: token
                    });
                });
            }
        });
    });

router.route('/forgot/:token')
    .post( (req, res) => {
        var token = req.params.token;
        if(token){
            jwt.verify(token, config.jwtsecretTemp, (err, decoded) => {
                if(err){
                    res.send({success: false, message: 'Failed to authenticate token!'});
                    fs.appendFile(serverlog, {success: false, message: 'Failed to authenticate token!'});
                    return;
                } else {
                    User.find().where('_id').in(decoded._doc._id).exec( (err, user) => {
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
                                message: 'Authentication failed! User not found.'
                            });
                        } else if(user) {
                            var passwordData = hashpwd.sha512(req.body.password, user.salt);
                            if(user.password == passwordData.passwordHash){
                                res.json({
                                    success: false,
                                    message: 'Password must be different from the last one.'
                                });
                            } else {
                                user.password = passwordData;
                                user.lastUpdate = new Date();

                                user.save((err) => {
                                    if(err){
                                        res.json({
                                            success: false,
                                            error: err
                                        });
                                        fs.appendFile(serverlog,`${err}\n`);
                                    } else {
                                        fs.appendFile(serverlog, `User ${user.name} password changedsuccessfully!\n`);
                                        res.status(200).json({
                                            success: true,
                                            message: `User ${user.name} password changed successfully!`
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } else {
            return res.status(403).json({
                success: false,
                message: 'No token provided!'
            });
        }
    });

};