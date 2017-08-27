var userModel = require('../model/user-model');
var usersControl = {};

/*User Controller - Add New User or Verify Existing User and Generate Session Key*/
usersControl.addNewUser = function (req, res){
    var userName = req.body.userName;
    var userPassword = req.body.userPassword;
    var userFullName = req.body.userFullName;
    var userType = req.body.userType;

    var userAdd = userModel.addNewUser(userName, userFullName, userPassword, userType);
    res.send(userAdd);
}

usersControl.userLogin = function (req, res){
    var userName = req.body.userName;
    var userPassword = req.body.userPassword;

    var userAdd = userModel.authUserLogin(userName, userPassword);
    userAdd.then(function(userData){
        if(userData.userName != ''){
            res.send({userName:userData.userName, userType:userData.userType, userFullName:userData.userFullName, status:1, userAuthentication:userData.userActiveSession});
        }
        else{
            res.send({'error':'invalid login'});
        }
    }, function(){
        res.send({'error':'invalid login'});
    });
}

usersControl.subscribeToSubjectControl = function(req, res){
    var userName = req.body.userName;
    var subjectName = req.body.subjectName;
    var userSubscribe = userModel.subscribeToSubject(userName,subjectName);
    userSubscribe.then(function(subscribeData){
        res.send(subscribeData);
    }, function(){
        res.send({'error':'error'});
    });
}

usersControl.subscribedSubjectStatusControl = function(req, res){
    var userName = req.body.userName;
    var subjectName = req.body.subjectName;
    var subjectStep = req.body.subjectStep;
    var subjectStatus = req.body.subjectStatus;

    var userSubscribe = userModel.subscribedSubjectStatus(userName,subjectName, subjectStep, subjectStatus);
    userSubscribe.then(function(subscribeData){
        res.send(subscribeData);
    }, function(){
        res.send({'error':'error'});
    });
}

usersControl.unSubscribedSubjectControl = function(req, res){
    var userName = req.body.userName;
    var subjectName = req.body.subjectName;

    var userSubscribe = userModel.unSubscribeToSubject(userName,subjectName);
    userSubscribe.then(function(subscribeData){
        res.send(subscribeData);
    }, function(){
        res.send({'error':'error'});
    });
}

usersControl.getUserDataControl = function(req, res){
    var userName = req.body.userName;

    var userSubscribe = userModel.getUserData(userName);
    userSubscribe.then(function(subscribeData){
        res.send(subscribeData);
    }, function(){
        res.send({'error':'error'});
    });
}

usersControl.viewUserSubjectStatControl = function(req, res){
    var userName = req.body.userName;
    var subjectName = req.body.subjectName;

    var userSubscribe = userModel.viewUserSubjectStat(userName,subjectName);
    userSubscribe.then(function(subscribeData){
        res.send(subscribeData);
    }, function(){
        res.send({'error':'error'});
    });
}

module.exports = usersControl;