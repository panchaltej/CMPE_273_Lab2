var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";
var ObjectID = require('mongodb').ObjectID;
const fs = require('fs');

function handle_createrequest(msg, callback){
    var reqUserId = msg.reqUserId;
    var parentId = msg.parentId;
    var reqFolderName = msg.reqFolderName;
    var res = {};
    console.log("$$%$%#$%#$%#$%#$%"+parentId);
    var folderpath = '';
    var newfolderpath = '';
    var addFolder = "";

    if (parentId != "") {
        try {
            var insertedFolderId = new ObjectID();
            mongo.connect(mongoURL, function(){
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('Users');
                console.log("Inside uploadFile within a parent folder ***************");

                coll.findOne({'_id': ObjectID(reqUserId),'Files._id': ObjectID(parentId)}, {'Files.$':1}, function(err, result){
                    if(err){
                        console.log(err);
                    }
                    if (result){
                        console.log("#$%@#$#$%@#$@$@$@$^#%^#$%#%^#%$%#$^"+result.Files[0].Path);
                        folderpath = result.Files[0].Path;
                        newfolderpath = folderpath + "/" + parentId;
                        
                        var userId = {_id: ObjectID(reqUserId)};
                        var addFileQuery = {$push: {
                            Files:{
                                _id: insertedFolderId,
                                Name: reqFolderName,
                                Type: '1',
                                Members: '',
                                IsStarred: '0',
                                UserId: reqUserId,
                                ParentId:parentId,
                                Path: newfolderpath
                            }
                        }};
                        coll.update(userId, addFileQuery, function(err, result){
                            if(err){
                                console.log('Folder creation failed');
                                console.log(err);
                                res.code = 501;
                            }
                            else{
                                res.code = 201;
                                console.log('Folder created');
                                res.code = 201;
                                res.value = {newfolderpath, insertedFolderId};
                                var datenow = new Date();
                                var addActivityQuery = {$push: {
                                    Activity:{
                                        _id: new ObjectID(),
                                        Description: 'Created folder '+reqFolderName,
                                        ActivityTime: datenow
                                    }
                                }}
                                coll.update(userId, addActivityQuery, function(err, user){
                                    if (err) throw err;
                                    else {
                                        console.log('Folder activity added');
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
        newfolderpath = reqUserId;
        var insertedFolderId = new ObjectID();
        var userId = {_id: ObjectID(reqUserId)};
        var addFileQuery = {$push: {
            Files:{
                _id: insertedFolderId,
                Name: reqFolderName,
                Type: '1',
                Members: '',
                IsStarred: '0',
                UserId: reqUserId,
                ParentId:'',
                Path: newfolderpath
            }
        }};
        try {
            mongo.connect(mongoURL, function(){
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('Users');
                console.log("Inside createFolder with empty parent ***************");

                coll.update(userId, addFileQuery, function(err, result){
                    if(err){
                        console.log(err);
                        res.code = 501;
                    }
                    else{
                        res.code = 201;
                        console.log('Folder created');
                        res.code = 201;
                        res.value = insertedFolderId
                        // if(!fs.existsSync('./files/'+reqUserId))
                        //     fs.mkdirSync('./files/'+reqUserId);
                        // fs.mkdirSync("./files/"+ reqUserId + "/"+ insertedFolderId);
                        var datenow = new Date();
                        var addActivityQuery = {$push: {
                            Activity:{
                                _id: new ObjectID(),
                                Description: 'Created folder '+reqFolderName,
                                ActivityTime: datenow
                            }
                        }}
                        coll.update(userId, addActivityQuery, function(err, user){
                            if (err) throw err;
                            else {
                                console.log('Folder activity added');
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
exports.handle_createrequest = handle_createrequest;