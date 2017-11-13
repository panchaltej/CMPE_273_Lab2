var assert = require('assert');
var request = require('request');
var login = require('./routes/login');
var http = require("http");

describe('Testing Server side of Dropbox', function() {

    it('should return the login page if the url is correct', function(done) {
        http.get('http://localhost:3001/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should return 404 page not found if the url is wrong', function(done) {
        http.get('http://localhost:3001/abc', function(res) {
            assert.equal(404, res.statusCode);
            done();
        })
    });

    it('should be able to login with correct credentials', function(done) {
        request.post('http://localhost:3001/login/doLogin', {
            form : {
                username : 't@gmail.com',
                password : 't',
                credentials: true
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(201, response.statusCode);
            done();
        });
    });

    it('should not login for incorrect credentials', function(done) {
        request.post('http://localhost:3001/login/doLogin', {
            form : {
                username : 'x@yahoo.com',
                password : 'x',
                credentials: true
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(401, response.statusCode);
            done();
        });
    });

    it('should signup', function(done) {
        request.post('http://localhost:3001/signup/doSignup', {
            form : {
                firstname: "Jon",
                lastname: "Snow",
                emailid : 'snow@gmail.com',
                password : 'snow',
                // credentials: true
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(201, response.statusCode);
            done();
        });
    });

    it('should not signup as user already exists', function(done) {
        request.post('http://localhost:3001/signup/doSignUp', {
            form : {
                firstname: "Tejas",
                lastname: "Panchal",
                username : 't@gmail.com',
                password : 't',
                // credentials: true
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(401, response.statusCode);
            done();
        });
    });

    it('fetches shared files of logged in user', function(done) {
        request.post('http://localhost:3001/files/getFiles', {
            form : {
                userId: "",
                emailId: "t@gmail.com",
                parentId : "",
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(200, response.statusCode);
            done();
        });
    });

    it('fetches directory of logged in user', function(done) {
        request.post('http://localhost:3001/files/getFiles', {
            form : {
                userId: "",
                emailId: "t@gmail.com",
                parentId : "",
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(200, response.statusCode);
            done();
        });
    });

    it('should signout the user on signout click', function(done) {
        request.post('http://localhost:3001/login/doLogout', {
            form : {
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(201, response.statusCode);
            done();
        });
    });

    it('should get the userinfo on usericon click', function(done) {
        request.post('http://localhost:3001/user/getUser', {
            form : {
                emailId: "t@gmail.com"
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(200, response.statusCode);
            done();
        });
    });
});