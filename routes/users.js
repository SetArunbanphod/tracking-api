const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const config = require('../config/database');

//Register
router.post('/register',function(req,res,next){
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.getUserByUsername(newUser.username,function(errUsername,username){
        if(errUsername){
            res.json({success: false,msg:err});
        }
        if(username){
            res.json({success: false,msg:'This username is already on the system.'});
        }
        else
        {
            User.getUserByEmail(newUser.email,function(errEmail,email){
                if(errEmail){
                    res.json({success: false,msg:err});
                }
                if(email){
                    res.json({success: false,msg:'This email is already on the system.'});
                }
                else{
                    User.addUser(newUser,function(errAdduser,user){
                        if(errAdduser) {
                            res.json({success: false,msg:'Fail to register user !!'});
                        }
                        else
                        {
                            const token = jwt.sign({
                                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                                user: newUser.username
                            },config.secret);
                            
                            res.json({
                                msg:'Register user success',
                                success : true,
                                token: token,
                                user: {
                                    username:newUser.username,
                                    email:newUser.email
                                }
                            });
                        }
                    })
                }
            })
        }
    })
});

//Authenticate
router.post('/auth',function(req,res,next){
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username,function(err,user){
        if(err) {
            return res.json({success: false , msg:err});
        }
        if(!user){
            return res.json({success: false , msg:'User not found!'});
        }
        User.comparePassword(password,user.password,function(err,isMatch){
            if(err) {
                return res.json({success: false , msg:err});
            }
            if(isMatch){
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    user: username
                },config.secret);
                
                res.json({
                    success : true,
                    token: token,
                    user: {
                        username:user.username,
                        email:user.email
                    }
                });
            }
            else{
                res.json({success: false, msg:'Password is incorrect!'});
            }
        });
    });
});

//Profile
 router.get('/profile',User.authorization,function(req,res,next){
    res.json({user : req.user})
}); 

module.exports = router;