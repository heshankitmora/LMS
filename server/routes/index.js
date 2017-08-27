var express = require('express');
var router = express.Router();

var userController = require('../controller/user-controller');
var subjectController = require('../controller/subject-controller');
var helpers = require('../helpers/helpers');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/newuser',userController.addNewUser);
router.post('/userlogin',userController.userLogin);
router.post('/addsubject',helpers.isAuthenticatedAdmin,subjectController.addNewSubject);
router.post('/updatesubject',helpers.isAuthenticatedAdmin,subjectController.updateSubject);
router.post('/addmodulesubject',helpers.isAuthenticatedAdmin,subjectController.addNewSubjectModule);

router.post('/viewallsubjects',helpers.isAuthenticated,subjectController.viewAllSubjects);
router.post('/subscribesubject',helpers.isAuthenticated,userController.subscribeToSubjectControl);
router.post('/unsubscribesubject',helpers.isAuthenticated,userController.unSubscribedSubjectControl);

router.post('/updatesubjectstatus',helpers.isAuthenticated,userController.subscribedSubjectStatusControl);
router.post('/viewsubscribedsubject',helpers.isAuthenticated,userController.viewUserSubjectStatControl);
router.post('/viewusersubjects', helpers.isAuthenticated, userController.getUserDataControl);

router.post('/viewsinglesubject',helpers.isAuthenticated, subjectController.viewSingleSubjects);
router.post('/viewsinglesubjectstep',helpers.isAuthenticated,subjectController.viewSingleSubjectsFromStep);

module.exports = router;
