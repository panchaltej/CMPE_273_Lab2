var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var kafka = require('./kafka/client');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username , password, done) {
        kafka.make_request('login_topic',{"reqUsername":username,"reqPassword":password}, function(err,results){
            console.log('in result');
            console.log(results);
            if(err){
                done(err,{});
            }
            else
            {
                if(results.code == 201){
                    done(null,{username: username, password: password});
                }
                else {
                    done(null,false);
                }
            }
        });
    }));
};

