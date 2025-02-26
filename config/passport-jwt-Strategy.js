const passport=require('passport');

const jwtStrategy=require('passport-jwt').Strategy;

const ExtractStrategy = require('passport-jwt').ExtractJwt;

const  Admin = require('../model/adminModel');

const Faculty = require('../model/facultyModel');

// Admin

const opts = {
    jwtFromRequest : ExtractStrategy.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'RNW'
}

passport.use(new jwtStrategy(opts , async (payload,done)=>{
    let checkAdminData = await Admin.findOne({email:payload.adminData.email});
    if(checkAdminData){
        return done(null,checkAdminData);
    }
    else{
        return done(null,false);
    }
}));


// Faculty 

const Fopts = {
    jwtFromRequest : ExtractStrategy.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'FRNW'
}

passport.use("Faculty",new jwtStrategy(Fopts , async (payload,done)=>{
    let checkFacultyData = await Faculty.findOne({email:payload.ft.email});
    if(checkFacultyData){
        return done(null,checkFacultyData);
    }
    else{
        return done(null,false);
    }
}));


passport.serializeUser((user,done)=>{
    return done(null,user.id)
})

passport.deserializeUser(async (id,done)=>{
    let userData = await Admin.findById(id);
    if(userData){
        return done(null,userData);
    }
    else{
        return done(null,false);
    }
})

module.exports=passport