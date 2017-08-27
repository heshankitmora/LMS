var mongoose = require('mongoose');
var q = require('q');
var Transaction = require('mongoose-transaction')(mongoose);

var subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required:true,
        unique:true
    },
    subjectDesc: {
        type: String,
        required:true
    },
    subjectTeacher:{
        type: String
    },
    subjectSteps:[{
        name:{
            type:String
        },
        step:{
            type:Number
        },
        stepDescription:String
    }]

});

var Subject = mongoose.model('subjects', subjectSchema);

//Inserting Sample Subjects
var subjectList = [
    { subjectName: 'Compilers', subjectDesc: 'Compilers ', subjectTeacher: 'Mr.Anil', subjectSteps:[{name:'Semester 1', step:1,stepDescription:'Semester 1'},{name:'Semester 2', step:2,stepDescription:'Semester 2'},{name:'Semester 3', step:3,stepDescription:'Semester 3'},{name:'Semester 4', step:4,stepDescription:'Semester 4'}]},
    { subjectName: 'Databases', subjectDesc: 'Databases ', subjectTeacher: 'Mr.Amila', subjectSteps:[{name:'Semester 1', step:1,stepDescription:'Semester 1'},{name:'Semester 2', step:2,stepDescription:'Semester 2'},{name:'Semester 3', step:3,stepDescription:'Semester 3'},{name:'Semester 4', step:4,stepDescription:'Semester 4'}]},
    { subjectName: 'Algorithms', subjectDesc: 'Algorithms ', subjectTeacher: 'Mr.Sunil', subjectSteps:[{name:'Semester 1', step:1,stepDescription:'Semester 1'},{name:'Semester 2', step:2,stepDescription:'Semester 2'},{name:'Semester 3', step:3,stepDescription:'Semester 3'},{name:'Semester 4', step:4,stepDescription:'Semester 4'}]}
];
var transaction = new Transaction();
subjectList.forEach(function(doc){
    transaction.insert('subjects', doc);
});

transaction.run(function(err, docs){
    console.log('Seed Subjects Completed');
});

var subjectModel = {};

subjectModel.createSubject = function(subjectName,subjectDesc,subjectTeacher){
    var error = false;
    if(!subjectName && !subjectDesc && !subjectTeacher){
        error = true;
    }

    if(error == false){
        var subjectMod = new Subject({subjectName:subjectName, subjectDesc:subjectDesc, subjectTeacher:subjectTeacher});
        subjectMod.save(function(err){
            if(err){
                subjectMod = {"error":"Error While Passing Data"};
            }
            console.log(err);
        });
    }
    return subjectMod;
}

subjectModel.addSubjectmodule = function(subjectName, name, step, stepDescription){
    var results = q.defer();

    Subject.find({subjectName:subjectName,subjectSteps:{$elemMatch:{name:name,step:step}}}, function(err,subjectDt){
        if(err){
            results.reject(err);
        }
        if(subjectDt.length){
            results.resolve(subjectDt);
        }
        else{
            Subject.update({subjectName:subjectName},{$push:{'subjectSteps':{$each:[{name:name, step:step,stepDescription:stepDescription}]}}}, function(err){
                if(err){
                    results.reject(err);
                }
                else{
                    Subject.findOne({subjectName:subjectName}, function(err, dbSubject){
                        if (err){
                            results.reject(err);
                        }
                        else{
                            results.resolve(dbSubject);
                        }

                    });
                }
            });
        }
    });

    return results.promise;
}

subjectModel.updateSubject = function(subjectName,subjectDesc,subjectTeacher){
    var results = q.defer();
    Subject.findOneAndUpdate({subjectName: subjectName}, {subjectDesc: subjectDesc,subjectTeacher:subjectTeacher}, function(err, subjectData){
        var statUpdate = 0;
        if(err){
            results.reject(err);
        }

        if(subjectData){
            results.resolve(subjectData);
        }
        else{
            results.reject({'error':'error occured'});
        }

    });
    return results.promise;
}

subjectModel.viewAllSubjects = function(){
    var results = q.defer();
    Subject.find({},function(err,subjectDataAll){
        if(err){
            results.reject(err);
        }

        if(subjectDataAll){
            results.resolve(subjectDataAll);
        }
        else{
            results.reject({'error':'error occured'});
        }
    });
    return results.promise;
}

subjectModel.viewSingleSubject = function(subjectName){
    var results = q.defer();
    Subject.findOne({subjectName:subjectName},function(err,subjectData){
        if(err){
            results.reject(err);
        }

        if(subjectData){
            results.resolve(subjectData);
        }
        else{
            results.reject({'error':'error occured'});
        }
    });
    return results.promise;
}

subjectModel.getSubjectStep = function(subjectName, step){
    var results = q.defer();

    Subject.find({subjectName:subjectName,subjectSteps:{$elemMatch:{step:step}}}, function(err,subjectDt){
        if(err){
            results.reject(err);
        }
        if(subjectDt){
            results.resolve(subjectDt);
        }
        else{

        }
    });

    return results.promise;
}

module.exports = subjectModel;