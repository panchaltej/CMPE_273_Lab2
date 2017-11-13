var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";

function handle_getrequest(msg, callback){

    
    var reqUsername = msg.reqUsername;
    var res = {};
    
    try {
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('Users');
            coll.findOne({EmailId: reqUsername}, function(err, result){
                if(err){
                    console.log(err);
                    res.code = 401;
                }
                if (result){
                    console.log('UserInfo fetched');
                    res.code = 201;
                    res.value = {
                        UserId: result._id,
                        FirstName: result.FirstName,
                        LastName: result.LastName,
                        EmailId: result.EmailId,
                        Password: result.Password,
                        Work: result.Work,
                        Education: result.Education,
                        Contact: result.Contact,
                        Interests: result.Interests,
                        Files: result.Files,
                        SharedFiles:result.SharedFiles,
                        Activity: result.Activity
                    }
                }
                callback(null, res);
            });
        });
    }
    catch (e){
        console.log(e);
    }
}

function handle_updaterequest(msg, callback){
    
        
        var reqUserEmail = msg.reqUserEmail;
        var reqUserFname = msg.reqUserFname;
        var reqUserLname = msg.reqUserLname;
        var reqUserWork = msg.reqUserWork;
        var reqUserEducation = msg.reqUserEducation;
        var reqUserContact = msg.reqUserContact;
        var reqUserInterests = msg.reqUserInterests;
        var res = {};
        
        try {
            mongo.connect(mongoURL, function(){
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('Users');

                var query = {EmailId: reqUserEmail};
                var updatedValue = {$set:{FirstName: reqUserFname, LastName: reqUserLname, Work: reqUserWork, Education: reqUserEducation, Contact: reqUserContact, Interests: reqUserInterests}};

                coll.update(query, updatedValue, function(err, result){
                    if(err){
                        console.log(err);
                        res.code = 501;
                    }
                    else{
                        console.log('UserInfo Updated');
                        res.code = 201;
                        res.value = {
                            message:"User Updated"
                        }
                    }
                    callback(null, res);
                });
            });
        }
        catch (e){
            console.log(e);
        }
    }

exports.handle_updaterequest = handle_updaterequest;
exports.handle_getrequest = handle_getrequest;