var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";

function handle_request(msg, callback){

    var reqFirstname = msg.reqFirstname;
    var reqLastname = msg.reqLastname;
    var reqEmail = msg.reqEmail;
    var reqPassword = msg.reqPassword;
    var res = {};
    try {
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('Users');
            coll.findOne({EmailId: reqEmail}, function(err, user){
                if (user) {
                    console.log("User already exists");
                    res.code = "401";
                    res.value = "User Exists";
                    callback(null, res);
                } else {
                    var document = {FirstName: reqFirstname, LastName:reqLastname, EmailId:reqEmail, Password:reqPassword, Work: '', Education: '', Contact: '', Interests: '', Files: [], SharedFiles:[], Activity: []};
                    coll.insert(document, function(err, result) {
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log('Valid SignUp');
                            res.code = "201";
                            res.value = "Signup Successful";
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

exports.handle_request = handle_request;