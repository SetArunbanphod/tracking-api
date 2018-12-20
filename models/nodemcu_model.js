const mongoose = require('mongoose');

const nodemucSchema = mongoose.Schema({
    username:{
        type:String
    },
    car_id:{
        type:String
    },
    nodemcu_id:{
        type:String
    },
    nodemcu_name:{
        type:String
    }
});

const Nodemcu = module.exports = mongoose.model('Nodemcu',nodemucSchema);

module.exports.getNodemcuById = function(id,callback){
    Nodemcu.findById(id,callback);
}

module.exports.getNodemcusByCar_id = function(car_id,callback){
    const query = {car_id: car_id};
    Nodemcu.find(query,callback);
}

module.exports.addNodemcu = function(newNodemcu,callback){
    newNodemcu.save(callback);
}

module.exports.removeNodemcu = function(nodemcu_id,callback){
    const query = {nodemcu_id: nodemcu_id};
    Nodemcu.findOne(query,callback);
}

