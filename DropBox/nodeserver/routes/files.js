var express = require('express');
var router = express.Router();
var mysql = require("./mysql");
var fileLocation = "";
var kafka = require('./kafka/client');

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";
var ObjectID = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// ############# MySQL ###############
// router.post('/getFiles', function (req, res, next) {

// 	//console.log(req);
// 	// var reqUserId = req.body.userDetail.UserId;
// 	var reqUserId = req.body.userId;
// 	var parentId = Number(req.body.parentId);
// 	var getUser='';

// 	console.log(parentId);
// 	if(parentId > 0){
// 		getUser = "SELECT * FROM Directory WHERE UserId = '"+reqUserId+"' AND ParentId='"+parentId+"'";
// 	}
// 	else{
// 		getUser = "SELECT * FROM Directory WHERE UserId = '"+reqUserId+"' AND ParentId IS NULL";
// 	}
// 	console.log("query is :" +getUser);
	
// 	mysql.fetchData(function(err, result){
// 		if(err){
// 			throw err;
// 		}
// 		else{
// 			// if(result.length>0){
// 				console.log('Valid Login');
// 				res.status(201).json({ result});
				
// 			// }
// 			// else
// 			{
// 				// console.log("Invalid Login");
// 				// res.status(401).json({message: "Login failed"});
// 			}
// 		}
// 	},getUser);
// });


// ############# MongoDB ###############
// router.post('/getFiles', function (req, res, next) {
	
// 		var reqUserId = req.body.userId;
// 		var reqUserEmail = req.body.emailId;
// 		var getUserQuery={EmailId: reqUserEmail};
// 		var filesQuery = {Files:1};
		
// 		try {
// 			mongo.connect(mongoURL, function(){
// 				console.log('Connected to mongo at: ' + mongoURL);
// 				var coll = mongo.collection('Users');
// 				coll.find(getUserQuery, filesQuery).toArray(function(err, result){
// 					if (result){
// 						console.log('Files fetched');
// 						res.status(200).send({result});
// 					}
// 				});
// 			});
// 		}
// 		catch (e){
// 			console.log(e);
// 		}
// 	});

// ############# kafka ###############
router.post('/getFiles', function (req, res, next) {
	
		var reqUserId = req.body.userId;
		var reqUserEmail = req.body.emailId;
		var parentId = req.body.parentId;
		
		try {
			kafka.make_request('getdirectory_topic',{"reqUserId":reqUserId,"reqUserEmail":reqUserEmail, "parentId":parentId}, function(err,results){
				if(err) {
					res.status(500).json({message: "Unable to fetch files"});
				}
				if (results.code == 201){
					console.log('Files fetched');
					console.log("#########RESULTS##########");
					console.log(results.value);
					var filelist = results.value;
					res.status(200).send(filelist);
				}
				return res.end();
			});
		}
		catch (e){
			console.log(e);
		}
	});

// ############# MySQL ###############
// router.post('/updateFile', function (req, res, next) {
	
// 		var reqFileId = req.body.Id;
// 		var reqIsStarred = req.body.IsStarred;
// 		var updateFileQuery = "";
	

// 		if(reqIsStarred == 0){
// 			updateFileQuery = "UPDATE Directory SET IsStarred = 1 WHERE Id = '"+reqFileId+"'";
// 		}
// 		else{
// 			updateFileQuery = "UPDATE Directory SET IsStarred = 0 WHERE Id = '"+reqFileId+"'";
// 		}
// 		console.log("star is :" +reqIsStarred);
// 		console.log("query is :" +updateFileQuery);
		
// 		mysql.fetchData(function(err, result){
// 			if(err){
// 				throw err;
// 			}
// 			else{
// 				console.log('Valid Update');
// 				res.status(201).json({ message : "Update Successfull"});
// 			}
// 		},updateFileQuery);
// 	});

// ############# MongoDB ###############
// router.post('/updateFile', function (req, res, next) {
	
// 		var reqFileId = req.body.fileitem._id;
// 		var reqIsStarred = req.body.fileitem.IsStarred;
// 		var reqUserEmail = req.body.emailId;
// 		var updateFileQuery = "";
// 		var updatedValue = "";

// 		if(reqIsStarred == 0){
// 			updateFileQuery = {'EmailId': reqUserEmail, 'Files._id': ObjectID(reqFileId)};
// 			updatedValue = {$set:{
// 				'Files.$.IsStarred': '1'
// 			}};
// 		}
// 		else{
// 			updateFileQuery = {'EmailId': reqUserEmail, 'Files._id': ObjectID(reqFileId)};
// 			updatedValue = {$set:{
// 				'Files.$.IsStarred': '0'
// 			}};
// 		}

// 		mongo.connect(mongoURL, function(){
// 			console.log('Connected to mongo at: ' + mongoURL);
// 			var coll = mongo.collection('Users');
// 			coll.update(updateFileQuery, updatedValue, function(err, user){
// 				if (err) throw err;
// 				else {
// 					console.log('Star Updated');
// 					res.status(201).json({ message : "Update Successfull"});
// 				}
// 			});
// 		});
// 	});

// ############# Kakfa ###############
router.post('/updateFile', function (req, res, next) {
	
	var reqFileId = req.body.fileitem._id;
	var reqIsStarred = req.body.fileitem.IsStarred;
	var reqUserEmail = req.body.emailId;

	try {
		kafka.make_request('starfile_topic',{"reqFileId":reqFileId,
		"reqIsStarred": reqIsStarred,
		"reqUserEmail": reqUserEmail}, function(err,results){
			if(res.code == 501) {
				res.status(501).json({message: "Unable to star/unstart file"});
			}
			if (results.code == 201){
				console.log('UserInfo updated');
				res.status(201).json({ Message : "Star/Unstar successfull"});
			}
			return res.end();
		});
	}
	catch (e){
		console.log(e);
	}
});

router.post('/downloadFile', function (req, res, next) {
	
		var reqFileId = req.body.Id;
		var reqFileName = req.body.Name;
		var reqFilePath = req.body.Path;

		console.log("---------------------");
		console.log(reqFilePath);
		console.log(reqFileName);

		fileLocation = reqFilePath;
		res.download(fileLocation);
	});

router.get('/downloadFile', function (req, res, next) {
		res.download(fileLocation);
	});

// ############# MySqL ###############	
// router.post('/getSharedFiles', function (req, res, next) {
// 		var reqUserId = req.body.userId;
// 		var getShared='';
	
// 		// getShared = "SELECT * FROM Directory WHERE ',' && Members && ',' LIKE '%,"+reqUserId+",%'";
// 		getShared = "SELECT * FROM Directory WHERE Members IS NOT NULL";
		
// 		console.log("query is :" +getShared);
		
// 		mysql.fetchData(function(err, result){
// 			if(err){
// 				throw err;
// 			}
// 			else{
// 				console.log('Valid Login');
// 				var filelist = [];
// 				var members;
// 				for(var i=0; i<result.length; i++){
// 					members = result[i].Members;
// 					var arrMembers = members.split(",");
// 					if(arrMembers.indexOf(reqUserId)>=0){
// 						filelist.push(result[i])
// 					}
// 				}
// 				console.log("======", filelist);
// 				res.status(201).json( {filelist});
// 			}
// 		},getShared);
// 	});

// ############# Kafka ###############	
router.post('/getSharedFiles', function (req, res, next) {
	var reqUserId = req.body.userId;
	var reqUserEmail = req.body.emailId;

	try {
		kafka.make_request('getshared_topic',{"reqUserId":reqUserId, "reqUserEmail":reqUserEmail}, function(err,result){
			if(result.code == 501) {
				res.status(501).json({message: "Unable to fetch shared files"});
			}
			if (result.code == 201){
				console.log('Shared Files fetched');
				console.log(result.value);
				var filelist = result.value;
				res.status(201).send(filelist);
			}
			return res.end();
		});
	}
	catch (e){
		console.log(e);
	}
});

router.post('/setSharing', function (req, res, next) {
	var fileitem = req.body.file;
	var fileId = fileitem._id;
	var members= req.body.members;

	try {
		kafka.make_request('setshared_topic',{"fileitem":fileitem, "fileId":fileId, "members":members}, function(err,result){
			if(result.code == 501) {
				res.status(501).json({message: "Unable to set shared files"});
			}
			if (result.code == 201){
				console.log('Shared Files added');
				console.log(result.value);
				var filelist = result.value;
				res.status(200).send(filelist);
			}
			return res.end();
		});
	}
	catch (e){
		console.log(e);
	}
});

router.post('/deleteFile', function (req, res, next) {
	
	var reqFileId = req.body.fileitem._id;
	var reqUserEmail = req.body.emailId;

	try {
		kafka.make_request('deletefile_topic',{"reqFileId":reqFileId,
		"reqUserEmail": reqUserEmail}, function(err,results){
			if(res.code == 501) {
				res.status(501).json({message: "Unable to delete file/folder"});
			}
			if (results.code == 201){
				console.log('File/folder deleted');
				res.status(201).json({ Message : "Delete successful"});
			}
			return res.end();
		});
	}
	catch (e){
		console.log(e);
	}
});

module.exports = router;