var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";
var ObjectID = require('mongodb').ObjectID;
const fs = require('fs');

function handle_uploadrequest(msg, callback){
    var reqUserId = msg.reqUserId;
    var reqParentId = msg.reqParentId;
    var reqFileName = msg.reqFileName;
    var res = {};

    var getPathQuery = {_id: reqParentId};
    var folderPath = "";
    var addFile = "";

    if (reqParentId != "") {
        try {
            mongo.connect(mongoURL, function(){
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('Users');
                console.log("Inside uploadFile within a parent folder ***************");

                coll.findOne({'_id': ObjectID(reqUserId),'Files._id': ObjectID(reqParentId)}, {'Files.$':1}, function(err, result){
                    if(err){
                        console.log(err);
                    }
                    if (result){
                        folderPath = result.Files[0].Path;
                        
                        var location = "./files/"+ folderPath + "/" + reqParentId+ "/"+reqFileName;
                        var userId = {_id: ObjectID(reqUserId)};
                        var addFileQuery = {$push: {
                            Files:{
                                _id: new ObjectID(),
                                Name: reqFileName,
                                Type: '0',
                                Members: '',
                                IsStarred: '0',
                                UserId: reqUserId,
                                ParentId:reqParentId,
                                Path: location
                            }
                        }};
                        coll.update(userId, addFileQuery, function(err, result){
                            if(err){
                                console.log('File upload failed');
                                console.log(err);
                                res.code = 501;
                            }
                            else{
                                res.code = 201;
                                console.log('File uploaded');
                                res.code = 201;
                                res.value = folderPath;
                                var datenow = new Date();
                                var addActivityQuery = {$push: {
                                    Activity:{
                                        _id: new ObjectID(),
                                        Description: 'Uploaded file '+reqFileName,
                                        ActivityTime: datenow
                                    }
                                }}
                                coll.update(userId, addActivityQuery, function(err, user){
                                    if (err) throw err;
                                    else {
                                        console.log('File activity added');
                                    }
                                });
                            }
                            callback(null, res);
                        });
                    }
                });
            });
        }
        catch (e){
            console.log(e);
        }
    } 
    else {
        var location = "./files/"+reqUserId+"/"+reqFileName;
        var userId = {_id: ObjectID(reqUserId)};
        var addFileQuery = {$push: {
            Files:{
                _id: new ObjectID(),
                Name: reqFileName,
                Type: '0',
                Members: '',
                IsStarred: '0',
                UserId: reqUserId,
                ParentId:'',
                Path: location
            }
        }};
        try {
            mongo.connect(mongoURL, function(){
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('Users');
                console.log("Inside uploadFile with empty parent ***************");

                coll.update(userId, addFileQuery, function(err, result){
                    if(err){
                        console.log('File upload failed');
                        console.log(err);
                        res.code = 501;
                    }
                    else{
                        res.code = 201;
                        console.log('File uploaded');
                        res.code = 201;
                        res.value = {message: "File Uploaded"}
                        // if(!fs.existsSync('./files/'+reqUserId))
                        //     fs.mkdirSync('./files/'+reqUserId);
                        // fs.mkdirSync("./files/"+ reqUserId + "/"+ insertedFolderId);
                        var datenow = new Date();
                        var addActivityQuery = {$push: {
                            Activity:{
                                _id: new ObjectID(),
                                Description: 'Uploaded file '+reqFileName,
                                ActivityTime: datenow
                            }
                        }}
                        coll.update(userId, addActivityQuery, function(err, user){
                            if (err) throw err;
                            else {
                                console.log('File activity added');
                            }
                        });
                    }
                    callback(null, res);
                });
            });
        }
        catch (e){
            console.log(e);
        }
    }
}
exports.handle_uploadrequest = handle_uploadrequest;