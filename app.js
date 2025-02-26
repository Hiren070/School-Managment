const express = require('express');

const port = 8001 ;

const app = express();

const mongoose = require('./config/mongoose');

const session = require('express-session');

const passport = require('passport');

const jwtpassport = require('./config/passport-jwt-Strategy');

app.use(express.urlencoded());

app.use(session({
    name:'RNW',
    secret:'rnw-Test',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60
    }
}));

app.use(passport.initialize());

app.use(passport.session());

app.use('/api',require('./routes/api/v1/AdminRoutes'));

app.use('/api/faculty' , require('./routes/api/v1/FacultyRoutes'));

app.listen(port,(err)=>{
    if(err){
        console.log("error");
        return false;
    }
    console.log("server is running on Port:",port);
})