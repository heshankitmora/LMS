var sessionModel = {};

/*Genarating unique Session Key*/
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

sessionModel.makeSessionId = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 32; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

sessionModel.encrypt = function(enPassword){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(enPassword,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

sessionModel.decrypt = function(dePassword){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(dePassword,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

function makeSessionId()
{

}



function encrypt(enPassword){

}

function decrypt(dePassword){

}

module.exports = sessionModel;