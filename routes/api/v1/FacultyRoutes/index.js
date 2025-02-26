const express = require('express');

const routes = express.Router();

const passport = require('passport');

const FacultyCtl = require('../../../../controllers/api/v1/FacultyController/facultyCtl');

routes.post('/facultyLogin' , FacultyCtl.facultyLogin);

routes.get('/facultyProfile' , passport.authenticate('Faculty' , {failureRedirect:'/api/faculty/FailFacultyAuth'}) , FacultyCtl.facultyProfile);

routes.get('/FailFacultyAuth' , async (req,res) =>{
    try{
        return res.status(401).json({msg:'invalid Token...'});
    }
    catch(err){
        return res.status(400).json({msg:'something wrong..,'});
    }
});

routes.put('/editFacultyProfile/:id' , passport.authenticate('Faculty' , {failureRedirect:'/api/faculty/FailFacultyAuth'}) , FacultyCtl.editFacultyProfile);

module.exports = routes;