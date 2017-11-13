var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";

function handle_request(msg, callback){


    var reqUsername = msg.reqUsername;
    var reqPassword = msg.reqPassword;
    var res = {};
    try {
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('Users');

            coll.findOne({EmailId: reqUsername, Password:reqPassword}, function(err, user){
                if (user) {
                    res.code = "201";
                    res.value = "Login Succcessful";
                } 
                else {
                    res.code = "401";
                    res.value = "Login failed";
                }
                callback(null, res);
            });
        });
        
    }
    catch (e){
        console.log(e);
    }
}

exports.handle_request = handle_request;