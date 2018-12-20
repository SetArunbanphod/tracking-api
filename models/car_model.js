const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    car_id:{
        type:String
    },
    car_name:{
        type:String
    },
    username:{
        type:String
    },
    line_id:{
        type:String
    },
    high_temp:{
        type:Number
    },
    low_temp:{
        type:Number
    }
});

const Car = module.exports = mongoose.model('Car',carSchema);

module.exports.getCarById = function(id,callback){
    Car.findById(id,callback);
}

module.exports.getCarsByUsername = function(username,callback){
    const query = {username: username};
    Car.find(query,callback);
}

module.exports.addCar = function(newCar,callback){
    newCar.save(callback);
}

module.exports.removeCar = function(car_id,callback){
    const query = {car_id: car_id};
    Car.findOne(query,callback);

}