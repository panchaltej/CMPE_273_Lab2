var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";
var ObjectID = require('mongodb').ObjectID;

function handle_getrequest(msg, callback){

    var reqUserId = msg.reqUserId;
    var reqUserEmail = msg.reqUserEmail;
    var parentId = msg.parentId;
    console.log("%%%%%%%%%%%%%%%%%%%%%%"+parentId);

    var getUserQuery=[{$match:{EmailId:reqUserEmail}},{$project:{Files:{$filter:{input:'$Files',as:'files',cond:{$eq:['$$files.ParentId',parentId]}}}}}];
    var res = {};
    
    try {
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('Users');
            coll.aggregate(getUserQuery).toArray(function(err, result){
                if(err){
                    console.log(err);
                }
                if (result){
                    console.log('Files fetched');
                    console.log("!!!!!!!!!!!!!!!!!!"+result);
                    res.code = 201;
                    res.value = result[0].Files;
                }
                callback(null, res);
            });
        });
    }
    catch (e){
        console.log(e);
    }
}

function handle_starrequest(msg, callback){
    
    var reqFileId = msg.reqFileId;
	var reqIsStarred = msg.reqIsStarred;
    var reqUserEmail = msg.reqUserEmail;
    
    var updateFileQuery = "";
	var updatedValue = "";

	if(reqIsStarred == 0){
		updateFileQuery = {'EmailId': reqUserEmail, 'Files._id': ObjectID(reqFileId)};
		updatedValue = {$set:{
			'Files.$.IsStarred': '1'
		}};
	}
	else{
		updateFileQuery = {'EmailId': reqUserEmail, 'Files._id': ObjectID(reqFileId)};
		updatedValue = {$set:{
			'Files.$.IsStarred': '0'
		}};
	}

    var res = {};
    
    try {
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('Users');
            coll.update(updateFileQuery, updatedValue, function(err, result){
                if(err){
                    console.log(err);
                }
                if (result){
                    console.log('Star Updated');
                    res.code = 201;
                    res.value = {message : "Star/Unstar Successfull"}
                }
                callback(null, res);
            });
        });
    }
    catch (e){
        console.log(e);
    }
}

function handle_getsharedrequest(msg, callback){
    var reqUserId = msg.reqUserId;
    var reqUserEmail = msg.reqUserEmail;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@"+reqUserEmail);
    var getUserQuery={EmailId: reqUserEmail};
    var filesQuery = {SharedFiles:1};
    var res = {};
    
    try {
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('Users');
            coll.find(getUserQuery, filesQuery).toArray(function(err, result){
                if(err){
                    console.log('Unable to fetch Shared Files');
                    console.log(err);
                    res.code = 501;
                }
                else{
                    console.log('Shared Files fetched');
                    console.log("******"+{result});
                    res.code = 201;
                    res.value = result[0].SharedFiles;
                }
                callback(null, res);
            });
        });
    }
    catch (e){
        console.log(e);
    }
}

function handle_setsharedrequest(msg, callback){
    var fileitem = msg.fileitem;
    var fileId = msg.fileId;
    var members = msg.members;
    var flag = false;

    var res = {};

    var arrMembers = members.split(",");
    console.log("#########");
    console.log(arrMembers);

    var userEmailId={EmailId:{$in:arrMembers}};
    var addFileQuery = {$addToSet: {
        SharedFiles:{
            _id: fileitem._id,
            Name: fileitem.Name,
            Type: fileitem.Type,
            Members: fileitem.Members,
            IsStarred: fileitem.IsStarred,
            UserId: fileitem.UserId,
            ParentId:fileitem.ParentId,
            Path: fileitem.Path
        }
    }};
    
    try {
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('Users');
            
            coll.find(userEmailId).forEach(function(doc){
                coll.update({EmailId:doc.EmailId}, addFileQuery, function(err, result){
                    if(err){
                        console.log('File sharing failed');
                        console.log(err);
                        flag = true;
                    }
                    else{
                        console.log('File shared');
                    }
                    
                });
            })
            
        });
    }
    catch (e){
        console.log(e);
    }
    if(!flag){
        res.code = 201;
        res.value = {message: "File Shared"}
    }
    else{
        res.code = 501;
        res.value = {message: "File Sharing failed"}
    }
    callback(null, res);
}

function handle_deleterequest(msg, callback){
    
    var reqFileId = msg.reqFileId;
	var reqUserEmail = msg.reqUserEmail;
    
    var res = {};
    
    try {
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('Users');
            coll.update({EmailId: reqUserEmail},{$pull:{Files:{_id:ObjectID(reqFileId)}}}, function(err, result){
                if(err){
                    console.log(err);
                }
                else {
                    console.log('File Deleted');
                    res.code = 201;
                    res.value = {message : "File deleted Successfull"}
                }
                callback(null, res);
            });
        });
    }
    catch (e){
        console.log(e);
    }
}
exports.handle_deleterequest = handle_deleterequest;
exports.handle_starrequest = handle_starrequest;
exports.handle_getrequest = handle_getrequest;
exports.handle_getsharedrequest = handle_getsharedrequest;
exports.handle_setsharedrequest = handle_setsharedrequest;