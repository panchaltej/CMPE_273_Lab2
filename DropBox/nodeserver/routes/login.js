var express = require('express');
var router = express.Router();
var mysql = require("./mysql");
var CryptoJS = require("crypto-js");
var kafka = require('./kafka/client');
var passport = require('passport');
require('./passport')(passport);

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// ############# MySQL ###############
// router.post('/doLogin', function (req, res, next) {

//     // var reqUsername = req.body.username;
// 	// var reqPassword = req.body.password;

// 	var bytes  = CryptoJS.AES.decrypt(req.body.EncPassword.toString(), '123');
//     var plaintext = bytes.toString(CryptoJS.enc.Utf8);

// 	var reqUsername = req.body.EmailId;
//     var reqPassword = req.body.Password;

//     var getUser = "SELECT * FROM Users WHERE EmailId = '"+reqUsername+"' and Password = '"+reqPassword+"'";
// 	console.log("query is :" +getUser);
	
// 	mysql.fetchData(function(err, result){
// 		if(err){
// 			throw err;
// 		}
// 		else{
// 			if(result.length>0){
// 				console.log('Valid Login');
// 				res.status(201).json({message: "Login Succcessful"});
// 			}
// 			else
// 			{
// 				console.log("Invalid Login");
// 				res.status(401).json({message: "Login failed"})
// 			}
// 		}
// 	},getUser);
// });

// ############# MongoDB ###############
// router.post('/doLogin', function (req, res, next) {
	
// 		var reqUsername = req.body.EmailId;
// 		var reqPassword = req.body.Password;
		
// 		try {
//             mongo.connect(mongoURL, function(){
//                 console.log('Connected to mongo at: ' + mongoURL);
//                 var coll = mongo.collection('Users');

//                 coll.findOne({EmailId: reqUsername, Password:reqPassword}, function(err, user){
//                     if (user) {
//                         res.status(201).json({message: "Login Succcessful"});

//                     } else {
//                         res.status(401).json({message: "Login failed"});
//                     }
//                 });
//             });
//         }
//         catch (e){
//             console.log(e);
//         }
// 	});

// ############# Kafka ###############
router.post('/doLogin', function (req, res) {
    passport.authenticate('login', function(err, user) {
        if(err) {
            res.status(500).json({message: "Login failed"});
        }

        if(!user) {
            res.status(401).json({message: "Login failed"});
        }
        else{
            console.log("#####"+req.body.username);
            req.session.user = req.body.username;

            console.log(req.session.user);
            console.log("session initilized");
            res.status(201).json({message: "Login successful"}); 
        }
    })(req, res);



	
    // var reqUsername = req.body.EmailId;
    // var reqPassword = req.body.Password;
    
    // try {
    //     kafka.make_request('login_topic',{"reqUsername":reqUsername,"reqPassword":reqPassword}, function(err,results){
    //         if(err) {
    //             res.status(500).json({message: "Login failed"});
    //         }
    
    //         if(!results) {
    //             res.status(401).json({message: "Login failed"});
    //         }
    //         req.session.user = reqUsername;
    //         console.log(req.session.user);
    //         console.log("session initilized");
    //         return res.status(201).json({message: "Login successful"});
    //     });
    // }
    // catch (e){
    //     console.log(e);
    // }
});

router.post('/doLogout', function (req, res) {
    console.log(req.session.user);
    req.session.destroy();
    console.log('Session Destroyed');
    res.status(201).send();
});

module.exports = router;