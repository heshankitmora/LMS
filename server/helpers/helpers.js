var userModel = require('../model/user-model');

var helpers = {};

helpers.isAuthenticated = function(req, res, next){
    if(!req.query.userActiveSession){
        res.status(401);
        res.send({status:'error', error:'Not Authorized'});
    }
    else{
        var user = userModel.getUserSession(req.query.userActiveSession, req.body.userName);
        user.then(function(dbuser){
            if(dbuser){
                next();
            }
            else{
                res.status(401);
                res.send({status:'error',error:'Not Authorized.'});
            }
        });
    }
}

helpers.isAuthenticatedAdmin = function(req, res, next){
    if(!req.query.userActiveSession){
        res.status(401);
        res.send({status:'error', error:'Not Authorized'});
    }
    else{
        var user = userModel.getUserSession(req.query.userActiveSession, req.body.userName);
        user.then(function(dbuser){
            console.log(dbuser.userType);
            if(dbuser && dbuser.userType == 2){
                next();
            }
            else{
                res.status(401);
                res.send({status:'error',error:'Not Authorized.'});
            }
        });
    }
}

module.exports = helpers;