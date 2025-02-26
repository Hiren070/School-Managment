const express = require('express');

const routes = express.Router();

const AdminCtl = require('../../../../controllers/api/v1/AdminController/adminCtl');

const passport = require('passport');

routes.post('/adminRegister' , AdminCtl.adminRegister);

routes.post('/adminLogin' , AdminCtl.adminLogin);

routes.get('/adminProfile' , passport.authenticate('jwt' , {failureRedirect:'/api/adminFailLogin'}) , AdminCtl.adminProfile);

routes.get('/adminFailLogin' , async (req,res) =>{
    try{
        return res.status(401).json({msg:'invalid Token...'});
    }
    catch(err){
        return res.status(400).json({msg:'something wrong..,'});
    }
});

routes.put('/editAdminProfile/:id' , passport.authenticate('jwt' , {failureRedirect:'/api/adminFailLogin'}) , AdminCtl.editAdminProfile);

routes.get('/adminLogout' , async (req,res) =>{
    try{
        req.session.destroy((err) =>{
            if(err){
                return res.status(200).json({msg:'something wrong...'});
            }
            else{
                return res.status(200).json({msg:'go to login page...'});
            }
        });
    }
    catch(err){
        return res.status(400).json({msg:'something wrong..,'});
    }
});

routes.post('/adminChangePassword' , passport.authenticate('jwt' , {failureRedirect:'/api/adminFailLogin'}) , AdminCtl.adminChangePassword);

routes.post('/sendMail' , AdminCtl.sendMail);

routes.post('/updateForgetPassword' , AdminCtl.updateForgetPassword);

routes.post('/facultyRegister' , passport.authenticate('jwt' , {failureRedirect:'/api/adminFailLogin'}) , AdminCtl.facultyRegister);

module.exports = routes; 