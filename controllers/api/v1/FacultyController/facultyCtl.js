const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Faculty = require('../../../../model/facultyModel');

const passport = require('passport');

const nodemailer = require("nodemailer");

module.exports.facultyLogin = async(req,res)=>{
    try{
        let checkFacultyEmail = await Faculty.findOne({ email: req.body.email });
        if (checkFacultyEmail) {
            let checkPass = await bcrypt.compare(req.body.password, checkFacultyEmail.password);
            if (checkPass) {
                let Facultytoken = await jwt.sign({ ft: checkFacultyEmail }, 'FRNW' , {expiresIn:'1h'});
                return res.status(200).json({ msg: 'Faculty login Successfully', ft: Facultytoken });
            }
            else {
                return res.status(200).json({ msg: 'Invalid Password' });
            }
        }
        else {
            return res.status(200).json({ msg: 'Invalid Email' });
        }
    }
    catch(err){
        return res.status(400).json({ msg: 'something is Wrong' });
    }
}

module.exports.facultyProfile = async(req,res)=>{
    try{
        return res.status(200).json({ msg: 'Faculty' , data: req.user});
    }
    catch(err){
        return res.status(400).json({ msg: 'something is Wrong'});
    }
}

module.exports.editFacultyProfile = async (req,res) =>{
    try {
        let checkFacultyId = await Faculty.findById(req.params.id);
        if (checkFacultyId) {
            let updateFacultyProfile = await Faculty.findByIdAndUpdate(req.params.id, req.body);
            if (updateFacultyProfile) {
                let updateFacultyProfile = await Faculty.findById(req.params.id);
                return res.status(200).json({ msg: 'Faculty Profile Updated Successfully', data: updateFacultyProfile});
            }
            else {
                return res.status(200).json({ msg: 'Faculty Profile Not updated' });
            }
        }
        else {
            return res.status(200).json({ msg: 'Record Not Found' });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: 'something is Wrong' });
    }
}