var fs = require('fs');
var User = require('../models/users');
var jwt = require('jsonwebtoken');
var config = require('../../constants');

module.exports = function(router, serverlog){
router.route('/signup')
    .post( (req, res) => {
        var user = new User();

        user.name = req.body.name;
        user.password = req.body.password;
        user.email = req.body.email;
        //user.salt = req.body.salt;
        user.admin = true;
        user.created_on = new Date();
        user.lastUpdate = user.created_on;

        user.save((err) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog,`${err}\n`);
            } else {
                fs.appendFile(serverlog, `User ${user.name} created!\n`);
                res.status(200).json({message: `User ${user.name} created!`});
            }
        });
    });

router.route('/signin')
    .post( (req, res) => {
        User.findOne({name: req.body.name}, (err, user) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog,`${err}\n`);
                return;
            }
            if(!user){
                res.status(404).json({success: false, message: 'Authentication failed! User not found.'});
            } else if(user) {
                if(user.password != req.body.password){
                    res.status(404).json({success: false, message: 'Authentication failed! Wrong password.'});
                } else {
                    var token =jwt.sign(user, config.jwtsecret, {
                        expiresIn: "30d"
                    });

                    user.token = token;
                    user.save((err) => {
                        if(err){
                            res.send(err);
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
};