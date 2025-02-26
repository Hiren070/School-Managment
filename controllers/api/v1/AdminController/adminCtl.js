const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Admin = require('../../../../model/adminModel');

const Faculty = require('../../../../model/facultyModel');

const passport = require('passport');

const nodemailer = require("nodemailer");

const { MongoGridFSChunkError } = require('mongodb');

module.exports.adminRegister = async (req, res) => {
    try {
        let checkEmailExits = await Admin.findOne({ email: req.body.email });
        if (!checkEmailExits) {
            if (req.body.password == req.body.confirmPassword) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
                let LoginUser = await Admin.create(req.body);
                if (LoginUser) {
                    return res.status(200).json({ msg: 'Admin Registration Successfully...', Record: LoginUser });
                }
                else {
                    return res.status(200).json({ msg: 'Admin Not Login' });
                }
            }
            else {
                return res.status(200).json({ msg: 'Password & Confirm Password Both are Not Sem...' });
            }
        }
        else {
            return res.status(200).json({ msg: 'Email is Already Registed ! try New Email' });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: 'something is Wrong' });
    }
}

module.exports.adminLogin = async (req, res) => {
    try {
        let adminData = await Admin.findOne({ email: req.body.email });
        if (adminData) {
            let checkPass = await bcrypt.compare(req.body.password, adminData.password);
            if (checkPass) {
                let Admintoken = await jwt.sign({ adminData: adminData }, 'RNW');
                return res.status(200).json({ msg: 'login Successfully', Admintoken: Admintoken });
            }
            else {
                return res.status(200).json({ msg: 'Invalid Password' });
            }
        }
        else {
            return res.status(200).json({ msg: 'Invalid Email' });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: 'something is Wrong' });
    }
}

module.exports.adminProfile = async (req, res) => {
    try {
        return res.status(200).json({ msg: 'user Information', data: req.user });
    }
    catch (err) {
        return res.status(400).json({ msg: 'something is Wrong' });
    }
}

module.exports.editAdminProfile = async (req, res) => {
    try {
        let checkAdminId = await Admin.findById(req.params.id);
        if (checkAdminId) {
            let updateAdminProfile = await Admin.findByIdAndUpdate(req.params.id, req.body);
            if (updateAdminProfile) {
                let updateProfile = await Admin.findById(req.params.id);
                return res.status(200).json({ msg: 'Admin Profile Updated Successfully', data: updateProfile });
            }
            else {
                return res.status(200).json({ msg: 'Admin Profile Not updated' });
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

module.exports.adminChangePassword = async (req, res) => {
    try {
        let checkCurrentPassword = await bcrypt.compare(req.body.currentPassword, req.user.password,);
        if (checkCurrentPassword) {
            if (req.body.currentPassword != req.body.NewPassword) {
                if (req.body.NewPassword == req.body.ConfirmPassword) {
                    req.body.password = await bcrypt.hash(req.body.NewPassword, 10);
                    let updatePassword = await Admin.findByIdAndUpdate(req.user._id, req.body);
                    if (updatePassword) {
                        return res.status(200).json({ msg: 'Password Updated Successfully' });
                    }
                    else {
                        return res.status(200).json({ msg: 'Password Not Updated' });
                    }
                }
                else {
                    return res.status(200).json({ msg: 'NewPassword & ConfirmPassword Both Are Not Sem...' });
                }
            }
            else {
                return res.status(200).json({ msg: 'CurrentPassword & NewPassword Both Are Sem...' });
            }
        }
        else {
            return res.status(200).json({ msg: 'CurrentPassword Not Found' });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: 'something is Wrong' });
    }
}

module.exports.sendMail = async (req, res) => {
    try {
        let checkEmail = await Admin.findOne({ email: req.body.email });
        if (checkEmail) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "kevindankhara214@gmail.com",
                    pass: "vmxnsghdfrgladie",
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            let otp = Math.round(Math.random() * 100000);

            const info = await transporter.sendMail({
                from: 'kevindankhara214@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "Verify otp", // Subject line
                html: `Your OTP is Here: ${otp}`, // html body
            });

            const data = {
                email: req.body.email, otp
            }

            if (info) {
                return res.status(200).json({ msg: 'Mail Send Successfully...', data: data });
            }
            else {
                return res.status(200).json({ msg: 'Mail Not Send...', data: info });
            }
        }
        else {
            return res.status(200).json({ msg: 'invalid Email...' });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: 'something is Wrong' });
    }
}

module.exports.updateForgetPassword = async(req,res)=>{
    try{
        let checkEmail = await Admin.findOne({email:req.query.email});
        if(checkEmail){
            if(req.body.NewPassword == req.body.ConfirmPassword){
                req.body.password = await bcrypt.hash(req.body.NewPassword,10);
                let updatePass = await Admin.findByIdAndUpdate(checkEmail._id,req.body);
                if(updatePass){
                    return res.status(200).json({ msg: 'Password Updated Successfully...' });
                }
                else{
                    return res.status(200).json({ msg: 'Password Not Updated' });
                }
            }
            else{
                return res.status(200).json({ msg: 'NewPassword & ConfirmPassword Both Are Not Sem...' });
            }
        }
        else{
            return res.status(200).json({ msg: 'invalid Email' });
        }
    }
    catch(err){
        return res.status(400).json({ msg: 'something is Wrong' });
    }
}

module.exports.facultyRegister = async (req,res)=>{
    try{
        let ExitsEmail = await Faculty.findOne({email:req.body.email});
        if(!ExitsEmail){
            var gPass = generatePassword();
            var link = 'http://localhost:8001/api/';

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "kevindankhara214@gmail.com",
                    pass: "vmxnsghdfrgladie",
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            const info = await transporter.sendMail({
                from: 'kevindankhara214@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "Verify otp", // Subject line
                html: `<h1>Your Login Details</h1><p>email:${req.body.email}</p><p>password:${gPass}</p><p>For Login Click Here:${link}</p>`, // html body
            });

            if (info) {
                let encyGpass = await bcrypt.hash(gPass,10);
                let AddFaculty = await Faculty.create({email:req.body.email,password:encyGpass,username:req.body.username});
                if(AddFaculty){
                    return res.status(200).json({ msg: 'Check Your Mail & Login'});
                }
                else{
                    return res.status(400).json({ msg: 'Faculty Not Register'});
                } 
            }
            else {
                return res.status(200).json({ msg: 'Mail Not Send...', data: info });
            }

        }
        else{
            return res.status(200).json({ msg: 'Faculty Email Already Exits...' });
        }
    }
    catch(err){
        return res.status(400).json({ msg: 'something is Wrong' });
    }
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}