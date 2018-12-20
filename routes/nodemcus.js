const express = require('express');
const router = express.Router();
const Nodemcu = require('../models/nodemcu_model');

//Add nodemcu
router.post('/addnodemcu',function(req,res,next){
    let newNodemcu = new Nodemcu({
        username: req.body.username,
        car_id: req.body.car_id,
        nodemcu_id: req.body.nodemcu_id,
        nodemcu_name: req.body.nodemcu_name
    });

    Nodemcu.addNodemcu(newNodemcu,function(err,nodemcu){
        if(err){
            res.json({success: false,msg:err});
        }
        else{
            Nodemcu.getNodemcusByCar_id(newNodemcu.car_id,function(err,nodemcus){
                if(err){
                    res.json({success: false,msg:err});
                }
                else{
                    res.json({success: true,nodemcus:nodemcus});
                }
            });
        }
    });
});


router.post('/findnodemcu',function(req,res,next){
    let car_id = req.body.car_id;
    Nodemcu.getNodemcusByCar_id(car_id,function(err,nodemcus){
        if(err){
            res.json({success: false,msg:err});
        }
        else{
            res.json({success: true,nodemcus:nodemcus});
        }
    });
});

module.exports = router;