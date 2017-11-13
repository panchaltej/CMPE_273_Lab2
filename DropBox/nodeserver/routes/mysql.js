// var mysql = require('mysql');

// function getConnection(){
// 	var connection = mysql.createConnection({
// 		host : 'localhost',
// 		user : 'root',
// 		password : 'tejas',
// 		database : 'db_dropbox',
// 		port : '3306'
// 	});
// 	return connection;
// }

// function fetchData(callback, sqlquery){
	
// 	console.log("\nSQL Query::"+sqlquery);	
// 	var connection=getConnection();
	
// 	connection.query(sqlquery, function(err, rows, fields){
// 		if(err){
// 			console.log("ERROR :"+err.message);
// 		}
// 		else{
// 			console.log("Results : "+rows);
// 			callback(err, rows);
// 		}
// 	});
	
// 	console.log("\nConnection closed..");
// 	connection.end();
// }

// exports.fetchData = fetchData;





var mysql = require('mysql');

function getConnection(){
	var pool = mysql.createPool({
		host : 'localhost',
		user : 'root',
		password : 'tejas',
		database : 'db_dropbox',
		port : '3306',
		connectionLimit : 600
	});
	return pool;
}

function fetchData(callback, sqlquery){
	
		var pool = getConnection();
		pool.getConnection(function(err, connection) {
			connection.query(sqlquery, function(err, rows, fields){
				if(err){
					callback(err, rows);
					console.log("ERROR :"+err.message);
				}
				else{
					console.log("Results : "+rows);
					callback(err, rows);
				}
			});
			connection.release();
		});
	};


exports.fetchData = fetchData;