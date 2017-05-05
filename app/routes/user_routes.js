var fs = require('fs');
var User = require('../models/users');

module.exports = function(router, serverlog){
router.route('/user')
    .get((req, res) => {
        User.find((err, users) => {
            if(err){
                res.send(err);
                fs.appendFile(serverlog, `${err}\n`);
            } else {
                fs.appendFile(serverlog,`${users}\n`);
                res.status(200).json(users);
            }
        });
    });
};