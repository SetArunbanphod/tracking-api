const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//Connecting firebase
var request = require('request')
const firebaseConfig = require('./config/firebase');
const firebase = require('firebase');
firebase.initializeApp(firebaseConfig.firebase);
var database = firebase.database();

database.ref('nodemcu').on('child_changed', function (snapshot) {
    const snapnodemcu = snapshot.val();
    if ((snapnodemcu.high_temp != undefined && snapnodemcu.low_temp != undefined) &&
        (snapnodemcu.temperature >= snapnodemcu.high_temp || snapnodemcu.temperature <= snapnodemcu.low_temp)) {
        database.ref('car/' + snapnodemcu.car_id).on('value', function (snapshot) {
            const snapcar = snapshot.val();
            if (snapcar.line_token != undefined) {
                const line_token = "Bearer " + snapcar.line_token;
                const line_message = " Notification !!! \n Car name : " + snapcar.car_name + " \n Node name : " + snapnodemcu.nodemcu_name +
                    "\n High temperature range : " + snapnodemcu.high_temp + " °C \n" +
                    " Low temperature range : " + snapnodemcu.low_temp + " °C \n" +
                    " !!! Current temperature  : " + snapnodemcu.temperature + " °C \n";
                const req = {
                    method: 'POST',
                    har: {
                        url: 'https://notify-api.line.me/api/notify',
                        method: 'POST',
                        headers: [
                            {
                                name: 'content-type',
                                value: 'application/x-www-form-urlencoded'
                            },
                            {
                                name: 'Authorization',
                                value: line_token
                            }
                        ],
                        postData: {
                            mimeType: 'application/x-www-form-urlencoded',
                            params: [
                                {
                                    name: 'message',
                                    value: line_message
                                }
                            ]
                        }
                    }
                }
                request(req);
            }
        })
    }
});



//Connect to database mongodb
mongoose.connect(config.database);

//On connection database
mongoose.connection.on('connected', function () {
    console.log('Connected to database ' + config.database);
})

//On connection database error
mongoose.connection.on('error', function (err) {
    console.log('Connected to database error! ' + err);
})

const app = express();
const users = require('./routes/users');
const cars = require('./routes/cars');
const nodemcus = require('./routes/nodemcus');

//Port number
const port = 3000;

//Cors midderware
app.use(cors());

//Set static folder 
app.use(express.static(path.join(__dirname, 'public')));

//Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Passport midleware 
app.use(passport.initialize());
app.use(passport.session());

//Routing path
app.use('/users', users);
app.use('/cars', cars);
app.use('/nodemcus', nodemcus);

//Index route
app.get('/', function (req, res) {
    res.send('Test listen port 3000');
})

//Start server
app.listen(port, function () {
    console.log('Server running on port ' + port);
})