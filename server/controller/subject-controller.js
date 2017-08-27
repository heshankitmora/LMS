var subjectModel = require('../model/subject-model');
var userModel = require('../model/user-model');
var subjectControl = {};

subjectControl.addNewSubject = function(req, res){
    var subjectName = req.body.subjectName;
    var subjectDesc = req.body.subjectDesc;
    var subjectTeacher = req.body.subjectTeacher;

    var subjectData = subjectModel.createSubject(subjectName,subjectDesc,subjectTeacher);
    res.send(subjectData);
}

subjectControl.updateSubject = function(req, res){
    var subjectName = req.body.subjectName;
    var subjectDesc = req.body.subjectDesc;
    var subjectTeacher = req.body.subjectTeacher;

    var subjectData = subjectModel.updateSubject(subjectName,subjectDesc,subjectTeacher);
    subjectData.then(function(subjectDataSingle){
        res.send(subjectDataSingle);
    }, function(){
        res.send({'error':'error occured'});
    });
}

subjectControl.viewAllSubjects = function(req,res) {
    var subjectAllData = subjectModel.viewAllSubjects();
    subjectAllData.then(function(subjectAllData){
        res.send(subjectAllData);
    }, function(){
        res.send({'error':'error occured'});
    });
}

subjectControl.viewSingleSubjects = function(req,res) {
    var subjectName = req.body.subjectName;
    var subjectData = subjectModel.viewSingleSubject(subjectName);
    subjectData.then(function(subjectResData){
        res.send(subjectResData);
    }, function(){
        res.send({'error':'error occured'});
    });
}

subjectControl.viewSingleSubjectsFromStep = function(req,res) {
    var subjectName = req.body.subjectName;
    var step = req.body.step;
    var subjectData = subjectModel.getSubjectStep(subjectName, step);
    subjectData.then(function(subjectResData){
        res.send(subjectResData);
    }, function(){
        res.send({'error':'error occured'});
    });
}

subjectControl.addNewSubjectModule = function(req,res){
    var subjectName = req.body.subjectName;
    var name = req.body.stepName;
    var step = req.body.step;
    var stepDescription = req.body.stepDescription;

    var statusModule = subjectModel.addSubjectmodule(subjectName,name,step,stepDescription);
    statusModule.then(function(statusModels){
        res.send(statusModels);
    }, function(err){
        res.send({'error':err});
    });
}



module.exports = subjectControl;