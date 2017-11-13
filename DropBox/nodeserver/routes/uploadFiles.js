var express = require('express');
var axios = require('axios');
var multer = require('multer');
var mysql = require('./mysql');
var router = express.Router();
const fs = require('fs');
var kafka = require('./kafka/client');

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";
var ObjectID = require('mongodb').ObjectID;

var upload = multer({ dest: './files'});

// ############# MySQL ###############
// router.post('/uploadFile', upload.any(), function (req, res, next) {
    
//     const file = req.files[0]; 
//     const meta = req.body; 
//     const reqUserId = req.body.userId;
//     const reqParentId = Number(req.body.parentId);
//     const reqFileName = req.body.name;
//     console.log("PARENT ID ====" +reqParentId);

//     var getPath = "SELECT * FROM Directory WHERE Id =" +reqParentId + "";
//     var folderPath = "";
//     var addFile = "";

//     if(reqParentId > 0){
//         mysql.fetchData(function (err, result) {
//             if (err) {
//                 throw err;
//             } else {
//                 folderPath = result[0].Path;
//                 console.log("PATH =====" + folderPath);
//                 fs.renameSync(file.path, "./files/"+ folderPath + "/" + reqParentId+ "/"+file.filename);

//                 var location = "./files/"+ folderPath + "/" + reqParentId+ "/"+file.filename;
//                 addFile = "INSERT INTO Directory(Name, Type, Members, IsStarred, UserId, ParentId, Path) Values ('"+reqFileName+"',0,'',0,"+reqUserId+","+reqParentId+",'"+location+"')";
//                 console.log(addFile);
//                 mysql.fetchData(function(err, result){
//                     if(err){
//                         throw err;
//                     }
//                     else{
//                         console.log('Valid Upload');
//                         var datenow = new Date();
//                         addActivityQuery = "INSERT INTO Activity(Description, UserId, ActivityTime) Values ( 'Uploaded File "+reqFileName+"'," + reqUserId + ",'" + datenow + "')";
//                                 console.log("inner query : " + addActivityQuery);
//                                 mysql.fetchData(function (err, result) {
//                                     if (err) {
//                                         throw err;
//                                     } else {
//                                         console.log("Activity Added");
//                                     }
//                                 }, addActivityQuery);
//                     }
//                 },addFile);
//                 res.end();
//             }
//         }, getPath);
//     }
//     else{
//         if(!fs.existsSync('./files/'+reqUserId))
//             fs.mkdirSync('./files/'+reqUserId);
//         fs.renameSync(file.path, "./files/"+reqUserId+"/"+file.filename);

//         var location = "./files/"+reqUserId+"/"+file.filename;
//         addFile = "INSERT INTO Directory(Name, Type, Members, IsStarred, UserId, Path) Values ('"+reqFileName+"',0,'',0,"+reqUserId+",'"+location+"')";
//         console.log(addFile);
//         mysql.fetchData(function(err, result){
//             if(err){
//                 throw err;
//             }
//             else{
//                 console.log('Valid Upload');
//                 var datenow = new Date();
//                 addActivityQuery = "INSERT INTO Activity(Description, UserId, ActivityTime) Values ( 'Uploaded File "+reqFileName+"'," + reqUserId + ",'" + datenow + "')";
//                         console.log("inner query : " + addActivityQuery);
//                         mysql.fetchData(function (err, result) {
//                             if (err) {
//                                 throw err;
//                             } else {
//                                 console.log("Activity Added");
//                             }
//                         }, addActivityQuery);
//             }
//         },addFile);
//         res.end();
//     }
// });


// ############# MongoDB ###############
// router.post('/uploadFile', upload.any(), function (req, res, next) {
    
//     const file = req.files[0]; 
//     const meta = req.body; 
//     const reqUserId = req.body.userId;
//     const reqParentId = req.body.parentId;
//     const reqFileName = req.body.name;
//     console.log("PARENT ID ====" +reqParentId);

//     // var getPath = "SELECT * FROM Directory WHERE Id =" +reqParentId + "";
//     var getPathQuery = {_id: reqParentId};
//     var folderPath = "";
//     var addFile = "";

//     if(reqParentId != ""){
//     }
//     else{
//         try {
//             if(!fs.existsSync('./files/'+reqUserId))
//                 fs.mkdirSync('./files/'+reqUserId);
//             fs.renameSync(file.path, "./files/"+reqUserId+"/"+file.filename);
    
//             var location = "./files/"+reqUserId+"/"+file.filename;
//             var userId = {_id: ObjectID(reqUserId)};
//             var addFileQuery = {$push: {
//                 Files:{
//                     _id: new ObjectID(),
//                     Name: reqFileName,
//                     Type: '0',
//                     Members: '',
//                     IsStarred: '0',
//                     UserId: reqUserId,
//                     ParentId:'',
//                     Path: location
//                 }
//             }}
//             mongo.connect(mongoURL, function(){
//                 console.log('Connected to mongo at: ' + mongoURL);
//                 var coll = mongo.collection('Users');
//                 console.log("Inside uploadFile with empty parent ***************");
//                 coll.update(userId, addFileQuery, function(err, user){
//                     if (err) throw err;
//                     else {
//                         console.log('File Uploaded');
//                         var datenow = new Date();
//                         var addActivityQuery = {$push: {
//                             Activity:{
//                                 _id: new ObjectID(),
//                                 Description: 'Uploaded file '+reqFileName,
//                                 ActivityTime: datenow
//                             }
//                         }}
//                         coll.update(userId, addActivityQuery, function(err, user){
//                             if (err) throw err;
//                             else {
//                                 console.log('File activity added');
//                             }
//                         });
//                     }
//                 });
//             });
//             res.end();
//         }
//         catch (e){
//             console.log(e);
//         }
//     }
// });


// ############# Kafka ###############
router.post('/uploadFile', upload.any(), function (req, res, next) {
    
    const file = req.files[0]; 
    const meta = req.body; 
    const reqUserId = req.body.userId;
    const reqParentId = req.body.parentId;
    const reqFileName = req.body.name;

    var folderPath = "";

    try {
        
        kafka.make_request('uploadfile_topic',{"reqUserId":reqUserId, 
        "reqParentId":reqParentId, "reqFileName":reqFileName}, function(err,results){
            if(res.code == 501) {
                res.status(500).json({message: "Unable to upload File"});
            }
            if (results.code == 201){
                console.log('File uploaded');
                res.status(200).json({ Message : "File Uploaded"});

                if(reqParentId != ""){
                    folderPath = results.value;
                    fs.renameSync(file.path, "./files/"+ folderPath + "/" + reqParentId+ "/"+reqFileName);
                }
                else{
                    if(!fs.existsSync('./files/'+reqUserId))
                        fs.mkdirSync('./files/'+reqUserId);
                    fs.renameSync(file.path, "./files/"+reqUserId+"/"+reqFileName);
                }
            }
            return res.end();
        });
    }
    catch (e){
        console.log(e);
    }
});



module.exports = router;