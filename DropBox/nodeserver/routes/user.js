var express = require('express');
var router = express.Router();
var mysql = require("./mysql");
var kafka = require('./kafka/client');

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// ############# MySQL ###############
// router.post('/getUser', function (req, res, next) {

// 	var reqUsername = req.body.emailId;

//     var getUser = "SELECT * FROM Users WHERE EmailId = '"+reqUsername+"'";
// 	console.log("query is :" +getUser);
	
// 	mysql.fetchData(function(err, result){
// 		if(err){
// 			throw err;
// 		}
// 		else{
// 			if(result.length>0){
// 				console.log('Valid Login');
// 				res.status(201).json({
//                     UserId: result[0].UserId,
//                     FirstName: result[0].FirstName,
//                     LastName: result[0].LastName,
//                     EmailId: result[0].EmailId,
//                     Password: result[0].Password,
//                     Work: result[0].Work,
//                     Education: result[0].Education,
//                     Contact: result[0].Contact,
//                     Interests: result[0].Interests
//                 });
// 			}
// 			else
// 			{
// 				console.log("Invalid Login");
// 				res.status(401).json({message: "Login failed"});
// 			}
// 		}
// 	},getUser);
// });


// ############# MongoDB ###############
// router.post('/getUser', function (req, res, next) {
	
// 		var reqUsername = req.body.emailId;
// 		try {
//             mongo.connect(mongoURL, function(){
//                 console.log('Connected to mongo at: ' + mongoURL);
//                 var coll = mongo.collection('Users');

//                 coll.findOne({EmailId: reqUsername}, function(err, user){
//                     if (user) {
//                         console.log('UserInfo Fetched');
// 						res.status(201).json({
// 							UserId: user._id,
// 							FirstName: user.FirstName,
// 							LastName: user.LastName,
// 							EmailId: user.EmailId,
// 							Password: user.Password,
// 							Work: user.Work,
// 							Education: user.Education,
// 							Contact: user.Contact,
// 							Interests: user.Interests,
// 							Files: user.Files,
// 							Activity: user.Activity
// 						});

//                     } else {
//                         res.status(401).json({message: "Unable to fetch user"});
//                     }
//                 });
//             });
//         }
//         catch (e){
//             console.log(e);
//         }
// 	});

// ############# Kafka ###############
router.post('/getUser', function (req, res, next) {
	var reqUsername = req.body.emailId;
	try {
		kafka.make_request('getuser_topic',{"reqUsername":reqUsername}, function(err,results){
			if(err) {
				res.status(500).json({message: "Unable to fetch User"});
			}
			if (results.code == 201){
				console.log('UserInfo fetched');
				var result = results.value;
				res.status(200).send(result);
			}
			return res.end();
		});
	}
	catch (e){
		console.log(e);
	}
});

// ############# MySQL ###############
// router.post('/updateUser', function (req, res, next) {
	
// 		var reqUserEmail = req.body.EmailId;
// 		var reqUserFname = req.body.FirstName;
// 		var reqUserLname = req.body.LastName;
// 		var reqUserWork = req.body.Work;
// 		var reqUserEducation = req.body.Education;
// 		var reqUserContact = req.body.Contact;
// 		var reqUserInterests = req.body.Interests;

	
// 		var updateUser = "UPDATE Users SET FirstName='"+reqUserFname+"', LastName='"+reqUserLname+"', Work='"+reqUserWork+"', Education='"+reqUserEducation+"', Contact='"+reqUserContact+"', Interests='"+reqUserInterests+"' WHERE EmailId = '"+reqUserEmail+"'";
// 		console.log("query is :" +updateUser);
		
// 		mysql.fetchData(function(err, result){
// 			if(err){
// 				throw err;
// 			}
// 			else{
// 				console.log('Valid Login');
// 				res.status(200).json({ Message : "User Updated"});
// 			}
// 		},updateUser);
// 	});


// ############# MongoDB ###############
// router.post('/updateUser', function (req, res, next) {
	
// 	var reqUserEmail = req.body.EmailId;
// 	var reqUserFname = req.body.FirstName;
// 	var reqUserLname = req.body.LastName;
// 	var reqUserWork = req.body.Work;
// 	var reqUserEducation = req.body.Education;
// 	var reqUserContact = req.body.Contact;
// 	var reqUserInterests = req.body.Interests;

// 	try {
// 		mongo.connect(mongoURL, function(){
// 			console.log('Connected to mongo at: ' + mongoURL);
// 			var coll = mongo.collection('Users');

// 			var query = {EmailId: reqUserEmail};
// 			var updatedValue = {$set:{FirstName: reqUserFname, LastName: reqUserLname, Work: reqUserWork, Education: reqUserEducation, Contact: reqUserContact, Interests: reqUserInterests}};

// 			coll.update(query, updatedValue, function(err, user){
// 				if (err) throw err;
// 				else {
// 					console.log('User Updated');
// 					res.status(200).json({ Message : "User Updated"});
// 				}

// 			});
// 		});
// 	}
// 	catch (e){
// 		console.log(e);
// 	}
	
// });

// ############# Kafka ###############
router.post('/updateUser', function (req, res, next) {
	
	var reqUserEmail = req.body.EmailId;
	var reqUserFname = req.body.FirstName;
	var reqUserLname = req.body.LastName;
	var reqUserWork = req.body.Work;
	var reqUserEducation = req.body.Education;
	var reqUserContact = req.body.Contact;
	var reqUserInterests = req.body.Interests;

	try {
		kafka.make_request('updateuser_topic',{"reqUserEmail":reqUserEmail,
		"reqUserFname": reqUserFname,
		"reqUserLname": reqUserLname, 
		"reqUserWork": reqUserWork, 
		"reqUserEducation": reqUserEducation, 
		"reqUserContact": reqUserContact, 
		"reqUserInterests": reqUserInterests}, function(err,results){
			if(res.code == 501) {
				res.status(500).json({message: "Unable to update User"});
			}
			if (results.code == 201){
				console.log('UserInfo updated');
				res.status(200).json({ Message : "User Updated"});
			}
			return res.end();
		});
	}
	catch (e){
		console.log(e);
	}
});



module.exports = router;