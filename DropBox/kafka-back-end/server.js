var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var signup = require('./services/signup');
var files = require('./services/files');
var activity = require('./services/activity');
var user = require('./services/user');
var folder = require('./services/folder');
var uploadfile = require('./services/uploadfile');

var topic_name = 'login_topic';
var consumer = connection.getConsumer(topic_name);
consumer.addTopics(['signup_topic', 'getdirectory_topic', 
    'getactivity_topic', 'getuser_topic', 
    'updateuser_topic', 'createfolder_topic',
    'uploadfile_topic', 'starfile_topic',
    'getshared_topic', 'setshared_topic', 'deletefile_topic'], function (error, done) {
    console.log(error, done); // <-- Never called and no messages for this topic is received
  });
var producer = connection.getProducer();

console.log('server is running');
consumer.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    switch(message.topic){
        case "login_topic":
            login.handle_request(data.data,function(err,res){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;
        case "signup_topic":
            signup.handle_request(data.data, function(err,res){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;
        case "getdirectory_topic":
            files.handle_getrequest(data.data, function(err,res){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;
        case "getactivity_topic":
            activity.handle_getrequest(data.data, function(err,res){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;
        case "getuser_topic":
            user.handle_getrequest(data.data, function(err,res){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;
        case "updateuser_topic":
            user.handle_updaterequest(data.data, function(err,res){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;
        case "createfolder_topic":
            folder.handle_createrequest(data.data, function(err,res){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;
        case "uploadfile_topic":
            uploadfile.handle_uploadrequest(data.data, function(err,res){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;
        case "starfile_topic":
            files.handle_starrequest(data.data, function(err,res){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;
        case "getshared_topic":
            files.handle_getsharedrequest(data.data, function(err,res){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;
        case "setshared_topic":
            files.handle_setsharedrequest(data.data, function(err,res){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;
        case "deletefile_topic":
            files.handle_deleterequest(data.data, function(err,res){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;
    }
});