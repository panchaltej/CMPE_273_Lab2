var express = require('express');
var router = express.Router();
var mysql = require("./mysql");
var kafka = require('./kafka/client');

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";

// ############# MySQL ###############
// router.post('/getActivity', function (req, res, next) {

//     var reqUserId = Number(req.body.userId);
//     console.log("@@@@@@@@@@@@@@@2"+reqUserId);
//     getActivity = "SELECT * FROM Activity WHERE UserId = '"+reqUserId+"' ORDER BY ActivityId DESC LIMIT 10";
// 	console.log("query is :" +getActivity);
	
// 	mysql.fetchData(function(err, result){
// 		if(err){
// 			throw err;
// 		}
// 		else{
//             console.log('Activity Fetched');
//             res.status(201).json({ result});
// 		}
// 	},getActivity);
// });

// ############# MongoDB ###############
// router.post('/getActivity', function (req, res, next) {
// 	var reqUserEmail = req.body.emailId;
// 	try {
// 		mongo.connect(mongoURL, function(){
// 			console.log('Connected to mongo at: ' + mongoURL);
// 			var coll = mongo.collection('Users');
// 			var sortByTime = {ActivityTime : -1}
// 			var query = {EmailId: reqUserEmail};
// 			coll.find(query).toArray(function(err, user){
// 				if (user){
// 					console.log('Activities fetched');
// 					res.status(200).send({user});
// 				}
// 			});
// 		});
// 	}
// 	catch (e){
// 		console.log(e);
// 	}
// });


// ############# Kafka ###############
router.post('/getActivity', function (req, res, next) {
	var reqUserEmail = req.body.emailId;
	try {
		kafka.make_request('getactivity_topic',{"reqUserEmail":reqUserEmail}, function(err,results){
			if(err) {
				res.status(500).json({message: "Unable to fetch activities"});
			}
			if (results.code == 201){
				console.log('Activities fetched');
				console.log("#########RESULTS##########");
				console.log(results.value);
				var result = results.value;
				res.status(200).send(results.value);
			}
			return res.end();
		});
	}
	catch (e){
		console.log(e);
	}
});

module.exports = router;