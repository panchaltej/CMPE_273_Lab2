var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/db_dropbox";

function handle_getrequest(msg, callback){

    
    var reqUserEmail = msg.reqUserEmail;
    var sortByTime = {ActivityTime : -1}
    var query = {EmailId: reqUserEmail};
    var res = {};
    
    try {
        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('Users');
            coll.find(query).toArray(function(err, result){
                if(err){
                    console.log(err);
                }
                if (result){
                    console.log('Activities fetched');
                    res.code = 201;
                    res.value = {result}
                }
                callback(null, res);
            });
        });
    }
    catch (e){
        console.log(e);
    }
}

exports.handle_getrequest = handle_getrequest;