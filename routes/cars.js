const express = require('express');
const router = express.Router();
const Car = require('../models/car_model');


//Add car
router.post('/addcar',function(req,res,next){
    let newCar = new Car({
        car_id: req.body.car_id,
        car_name: req.body.car_name,
        username: req.body.username,
        high_temp: req.body.high_temp,
        low_temp: req.body.low_temp,
        line_id: req.body.line_id
    });

    Car.addCar(newCar,function(err,car){
        if(err){
            res.json({success: false,msg:err});
        }
        else{
            Car.getCarsByUsername(newCar.username,function(err,cars){
                if(err){
                    res.json({success: false,msg:err});
                }
                else{
                    res.json({success: true,cars:cars});
                }
            });
        }
    });

});

router.post('/findcar',function(req,res,next){
    let username = req.body.username;
    Car.getCarsByUsername(username,function(err,cars){
        if(err){
            res.json({success: false,msg:err});
        }
        else{
            res.json({success: true,cars:cars});
        }
    })
});

module.exports = router;