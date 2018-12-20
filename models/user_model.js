const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required: true
    },
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
});

const User = module.exports = mongoose.model('User',userSchema);

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
}

module.exports.getUserByUsername = function(username,callback){
    const query = {username: username};
    User.findOne(query,callback);
}

module.exports.getUserByEmail = function(email,callback){
    const query = {email: email};
    User.findOne(query,callback);
}

module.exports.addUser = function(newUser,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,function(err,isMatch){
        if(err) throw err;
        callback(null,isMatch);
    });
}


module.exports.authorization = function(req,res,next){
    const token = req.headers['authorization'];
    if(token){
        jwt.verify(token, config.secret, function(err, decoded) {
            if(err){
                res.status(401).json({error : 'Token has expired.'});
            }
            else{
                if(decoded){
                    console.log(decoded);
                    const username = decoded.user;
                    User.getUserByUsername(username,function(err,user){
                        if(err){
                            res.json({err:'err find user'});
                        }
                        if(user){
                            req.user = user;
                            next();
                        }
                        else{
                            res.json({msg:'user not found'});
                        }
                    });
                }
                else{
                    res.json({error:'Decoded error!'});
                }
            }
        });
    }
    else{
        res.status(403).json({
            error : 'Token not found!'
        });
    }
}
