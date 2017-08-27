var mongoose = require('mongoose');
var q = require('q');
var Transaction = require('mongoose-transaction')(mongoose);
var sessionModel = require('./session-model');

/* Mongo - Create Mongo UserSchema*/
var userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required:true,
        unique:true
    },
    userPassword: {
        type: String,
        required:true
    },
    userFullName:{
        type: String,
        required:true
    },
    userType: {
        type: Number,
        required:true
    },
    userActiveSession: {
        type: String
    },
    userSubjects:[{
        name:String,
        subjectStatus:Number,
        subjectStep:Number
    }]
});

var User = mongoose.model('users', userSchema);

//Inserting Sample Users
//Admin Users - Type: 2 | Normal Users - Type 1
var userList = [
    { userName: 'heshan', userPassword: sessionModel.encrypt('123'), userFullName: 'Heshan Kithuldora', userType:1},
    { userName: 'student', userPassword: sessionModel.encrypt('123'), userFullName: 'Student Test', userType:1},

    { userName: 'admin', userPassword: sessionModel.encrypt('123'), userFullName: 'Student Test', userType:2}
];
var transaction = new Transaction();
userList.forEach(function(doc){
    transaction.insert('users', doc);
});

transaction.run(function(err, docs){
    console.log('Seed Users Completed');
});

var userModel = {};


/*User Model - Add New User*/
userModel.addNewUser = function (userName, userFullName, userPassword, userType) {
    var error = false;
    var userPasswordNew = sessionModel.encrypt(userPassword);
    if(!userName && !userFullName && !userPassword){
        error = true;
    }

    if(error == false){
        var userMod = new User({userName:userName, userFullName:userFullName, userPassword:userPasswordNew, userType:userType});
        userMod.save(function(err){
            if(err){
                userMod = {"error":"Error While Passing Data"};
            }
            console.log(err);
        });
    }
    return userMod;
}

userModel.viewSubjectStatusForUser = function(userName, subjectName){

}

/*User Model - Update Session Key when existing user login in to the system*/
userModel.updateUserSession = function(userActiveSession, userMode, userName){
    var results = q.defer();
    var query = {'userActiveSession':userActiveSession};
    var whereUser = {'userName':userName};
    userMode.findOneAndUpdate(whereUser, query, {new: true}, function(err, place){
        if(err){
            results.reject(err);
        }
        else{

            userMode.findOne({userName:userName}, function(err, dbuser){
                if(err){
                    results.reject(err);
                }
                if(dbuser){
                    results.resolve(dbuser);
                }
            });


        }
    });
    return results.promise;
}

/*User Model - Check User Login If User is new Create New User, Else verify existing Account and Generate Session Key*/
userModel.authUserLogin = function( userName, userPassword){
    var results = q.defer();
    var enPassword = sessionModel.encrypt(userPassword);
    User.findOne({userName:userName,userPassword:enPassword}, function(err, dbuser){
        if(err){
            results.reject(err);
        }
        if(dbuser){
            var sessionUpdate = sessionModel.makeSessionId();
            var userMod = userModel.updateUserSession(sessionUpdate, User, userName);
            userMod.then(function(users){
                    results.resolve(userMod);
                },
                function(err){
                    results.reject(err);
            });
        }
        else{
            results.reject({'error':'no user found'});
        }

    });
    return results.promise;

}

/*Get Single User Data*/
userModel.getUserData = function(userName){
    var results = q.defer();
    User.findOne({userName:userName}, function(err, dbuser){
        if (err){
            results.reject(err);
        }
        else{
            results.resolve(dbuser);
        }

    });
    return results.promise;
}

/*User Model - Check Users Session Key and Id when log in to the system*/
userModel.getUserSession = function(userActiveSession, userName){
    var results = q.defer();
    User.findOne({userActiveSession:userActiveSession,userName:userName}, function(err, dbuser){
        if (err){
            results.reject(err);
        }
        else{
            results.resolve(dbuser);
        }

    });
    return results.promise;
}

/*Subscribe User to a Subject*/
userModel.subscribeToSubject = function(userName, subjectName){
    var results = q.defer();
    User.find({userName:userName,userSubjects:{$elemMatch:{name:subjectName}}}, function(err,userDt){
        if(err){
            results.reject(err);
        }
        if(userDt.length){
            results.resolve(userDt);
        }
        else{
            User.update({userName:userName},{$push:{'userSubjects':{$each:[{name:subjectName, subjectStatus:0, subjectStep:1}]}}}, function(err){
                if(err){
                    results.reject(err);
                }
                else{
                    User.findOne({userName:userName}, function(err, dbuser){
                        if (err){
                            results.reject(err);
                        }
                        else{
                            results.resolve(dbuser);
                        }

                    });
                }
            });
        }
    });

    return results.promise;
}

/*unsubscribe User to a Subject*/
userModel.unSubscribeToSubject = function(userName, subjectName){
    var results = q.defer();
    User.update({userName:userName},{$pull:{'userSubjects':{name:subjectName}}}, function(err,dbuser){
        if(err){
            results.reject(err);
        }
        else{
            console.log(dbuser);
            results.resolve(dbuser);
        }
    });

    return results.promise;
}

userModel.viewUserSubjectStat = function(userName, subjectName){
    var results = q.defer();
    User.find({userName:userName,userSubjects:{$elemMatch:{name:subjectName}}}, function(err,userDt){
        if(err){
            results.reject(err);
        }
        if(userDt.length){
            results.resolve(userDt);
        }
        else{
            results.reject({'error':'no data found'});
        }
    });

    return results.promise;
}

userModel.subscribedSubjectStatus = function(userName, subjectName, step, status){
    var results = q.defer();
    User.find({userName:userName,userSubjects:{$elemMatch:{name:subjectName}}}, function(err,userDt){
        if(err){
            results.reject(err);
        }
        else{

            User.update({userName:userName},{$pull:{'userSubjects':{name:subjectName}}}, function(err){
                if(err){
                    results.reject(err);
                }
                else{
                    User.update({userName:userName},{$push:{'userSubjects':{$each:[{name:subjectName, subjectStep:step, subjectStatus:status}]}}}, function(err){
                        if(err){
                            results.reject(err);
                        }
                        else{
                            User.findOne({userName:userName}, function(err, dbuser){
                                if (err){
                                    results.reject(err);
                                }
                                else{
                                    results.resolve(dbuser);
                                }

                            });
                        }
                    });
                }
            });
        }
    });

    return results.promise;
}



module.exports = userModel;