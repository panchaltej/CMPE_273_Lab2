var express = require('express');
var router = express.Router();
var mysql = require("./mysql");
const fs = require('fs');
var kafka = require('./kafka/client');

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";
var ObjectID = require('mongodb').ObjectID;

// ############# MySQL ###############
// router.post('/createFolder', function (req, res, next) {

//     //console.log(req);
//     var reqUserId = req.body.userDetail.UserId;
//     var parentId = Number(req.body.parentId);
//     var reqFolderName = req.body.foldername;

//     var getPath = "SELECT * FROM Directory WHERE Id=" + parentId + "";
//     var folderpath = '';
//     var newfolderpath = '';
//     var addFolder = "";
//     console.log("GetPath: " + getPath);

//     if (parentId > 0) {
//         mysql.fetchData(function (err, result) {
//                 if (err) {
//                     throw err;
//                 } else {
//                     console.log("query : " + result);
//                     folderpath = result[0].Path;
//                     newfolderpath = folderpath + "/" + parentId;
//                     addFolder = "INSERT INTO Directory(Name, Type, Members, IsStarred, UserId, ParentId, Path) Va" +
//                             "lues ('" + reqFolderName + "',1,'',0," + reqUserId + "," + parentId + ",'" + newfolderpath + "')";

                            
                    
//                     mysql.fetchData(function (err, result) {
//                         if (err) {
//                             throw err;
//                         } else {
//                             console.log('Valid folder');
//                             //console.log(result);
//                             // fs.mkdirSync("./files/"+ reqUserId+ newfolderpath + "/"+ result.insertId);
//                             fs.mkdirSync("./files/"+ newfolderpath+ "/" + result.insertId);
//                             var datenow = new Date();
//                             addActivityQuery = "INSERT INTO Activity(Description, UserId, ActivityTime) Values ( 'Created Folder "+reqFolderName+"'," + reqUserId + ",'" + datenow + "')";
                            
//                                     console.log("inner query : " + addActivityQuery);
//                                     mysql.fetchData(function (err, result) {
//                                         if (err) {
//                                             throw err;
//                                         } else {
//                                             console.log("Activity Added");
//                                         }

//                                     }, addActivityQuery);

//                         }
//                     }, addFolder);
//                     res.end();

//                 }
//             }, getPath);
//     } else {
//         newfolderpath = reqUserId;
//         addFolder = "INSERT INTO Directory(Name, Type, Members, IsStarred, UserId, path) Values ('" + reqFolderName + "',1,'',0," + reqUserId + ", '" + newfolderpath + "')";

//         console.log("outer query : " + addFolder);
//         mysql.fetchData(function (err, result) {
//             if (err) {
//                 throw err;
//             } else {
//                 console.log('Valid folder');
//                 if(!fs.existsSync('./files/'+reqUserId))
//                 fs.mkdirSync('./files/'+reqUserId);
//                 fs.mkdirSync("./files/"+ reqUserId + "/"+ result.insertId);

//                 var datenow = new Date();
//                 addActivityQuery = "INSERT INTO Activity(Description, UserId, ActivityTime) Values ( 'Created Folder "+reqFolderName+"'," + reqUserId + ",'" + datenow + "')";
//                         console.log("inner query : " + addActivityQuery);
//                         mysql.fetchData(function (err, result) {
//                             if (err) {
//                                 throw err;
//                             } else {
//                                 console.log("Activity Added");
//                             }
//                         }, addActivityQuery);
//             }
//         }, addFolder);
//         res.end();
//     }
// });

// ############# MongoDB ###############
// router.post('/createFolder', function (req, res, next) {
    
//         var reqUserId = req.body.userId;
//         var parentId = Number(req.body.parentId);
//         var reqFolderName = req.body.foldername;
    
//         var folderpath = '';
//         var newfolderpath = '';
//         var addFolder = "";
    
//         if (parentId != "") {
//         } else {
//             newfolderpath = reqUserId;
//             var insertedFolderId = new ObjectID();
//             var userId = {_id: ObjectID(reqUserId)};
//             var addFileQuery = {$push: {
//                 Files:{
//                     _id: insertedFolderId,
//                     Name: reqFolderName,
//                     Type: '1',
//                     Members: '',
//                     IsStarred: '0',
//                     UserId: reqUserId,
//                     ParentId:'',
//                     Path: newfolderpath
//                 }
//             }};

//             mongo.connect(mongoURL, function(){
//                 console.log('Connected to mongo at: ' + mongoURL);
//                 var coll = mongo.collection('Users');
//                 console.log("Inside createFolder with empty parent ***************");
//                 coll.update(userId, addFileQuery, function(err, user){
//                     if (err) throw err;
//                     else {
//                         console.log('Folder Created');
//                         if(!fs.existsSync('./files/'+reqUserId))
//                             fs.mkdirSync('./files/'+reqUserId);
//                         fs.mkdirSync("./files/"+ reqUserId + "/"+ insertedFolderId);
//                         var datenow = new Date();
//                         var addActivityQuery = {$push: {
//                             Activity:{
//                                 _id: new ObjectID(),
//                                 Description: 'Created folder '+reqFolderName,
//                                 ActivityTime: datenow
//                             }
//                         }}
//                         coll.update(userId, addActivityQuery, function(err, user){
//                             if (err) throw err;
//                             else {
//                                 console.log('Folder activity added');
//                             }
//                         });
//                     }
//                 });
//             });
//             res.end();
//         }
//     });


// ############# Kafka ###############
router.post('/createFolder', function (req, res, next) {
    
    var reqUserId = req.body.userId;
    var parentId = req.body.parentId;
    var reqFolderName = req.body.foldername;
 
    try {
        kafka.make_request('createfolder_topic',{"reqUserId":reqUserId, 
        "parentId":parentId, "reqFolderName":reqFolderName}, function(err,results){
            if(res.code == 501) {
                res.status(500).json({message: "Unable to create Folder"});
            }
            if (results.code == 201){
                console.log('Folder created');
                res.status(200).json({ Message : "Folder Created"});
                
                if(parentId!=""){
                    var newfolderpath = results.value.newfolderpath;
                    var insertedFolderId = results.value.insertedFolderId;

                    fs.mkdirSync("./files/"+ newfolderpath+ "/" + insertedFolderId);
                }
                else{
                    insertedFolderId = results.value;
                    if(!fs.existsSync('./files/'+reqUserId))
                        fs.mkdirSync('./files/'+reqUserId);
                    fs.mkdirSync("./files/"+ reqUserId + "/"+ insertedFolderId);
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