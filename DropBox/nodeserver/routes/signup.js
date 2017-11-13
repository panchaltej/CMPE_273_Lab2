var express = require('express');
var router = express.Router();
var mysql = require("./mysql");
var kafka = require('./kafka/client');

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";

// ############# MySQL ###############
// router.post('/doSignup', function (req, res, next) {

//     var reqFirstname = req.body.firstname;
//     var reqLastname = req.body.lastname;
//     var reqEmail = req.body.emailid;
//     var reqPassword = req.body.password;

//     var addUser = "INSERT INTO Users(FirstName, LastName, EmailId, Password) Values ('"+reqFirstname+"','"+reqLastname+"','"+reqEmail+"','"+reqPassword+"')";
	
// 	mysql.fetchData(function(err, result){
// 		if(err){
// 			throw err;
// 		}
// 		else{
//             console.log('Valid SignUp');
//             res.status(201).json({message: "SignUp successful"});
// 		}
// 	},addUser);
// });


// ############# MongoDB ###############
// router.post('/doSignup', function (req, res, next) {
//         var reqFirstname = req.body.firstname;
//         var reqLastname = req.body.lastname;
//         var reqEmail = req.body.emailid;
//         var reqPassword = req.body.password;
//         try {
//             mongo.connect(mongoURL, function(){
//                 console.log('Connected to mongo at: ' + mongoURL);
//                 var coll = mongo.collection('Users');
//                 coll.findOne({EmailId: reqEmail}, function(err, user){
//                     if (user) {
//                         console.log("User already exists");
//                         res.status(401).json({message:"User Exists"});
//                     } else {
//                         var document = {FirstName: reqFirstname, LastName:reqLastname, EmailId:reqEmail, Password:reqPassword, Work: '', Education: '', Contact: '', Interests: '', Files: [], Activity: []};
//                         coll.insert(document, function(err, result) {
//                             if(err){
//                                 console.log(err);
//                             }
//                             else{
//                                 console.log('Valid SignUp');
//                                 res.status(201).json({message: "SignUp successful"});
//                             }
//                         });
//                     }
//                 });
//             });
//         }
//         catch (e){
//             console.log(e);
//         }
//     });

// ############# Kafka ###############
router.post('/doSignup', function (req, res, next) {
    var reqFirstname = req.body.firstname;
    var reqLastname = req.body.lastname;
    var reqEmail = req.body.emailid;
    var reqPassword = req.body.password;
    try {
        kafka.make_request('signup_topic',{"reqFirstname":reqFirstname,"reqLastname":reqLastname, "reqEmail":reqEmail, "reqPassword":reqPassword}, function(err,results){
            if(err) {
                throw err;
            }
            
            if(results.code == 401) {
                console.log("User already exists");
                res.status(401).json({message: "Signup failed"});
            }
            if(results.code == 201){
                console.log("Signup successful");
                res.status(201).json({message: "Signup successful"});
            }
            return res.end();
        });
    }
    catch (e){
        console.log(e);
    }
});

module.exports = router;