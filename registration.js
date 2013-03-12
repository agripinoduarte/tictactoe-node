var net = require('http');
var mongo = require('mongodb');
var username = '';
var password = '';

var client = new mongo.Db('tictactoe', new mongo.Server("127.0.0.1", 27017, {}), {w: 1}),
register = function (err, collection) {
  	collection.insert({username:username, password:password}, function (err, docs) {
  		console.log('Inserido: ' + username);
  	});
};

client.open(function(err, p_client) {
 	console.log('-- MongoDB Server Connected -- ');
});

var http = require('http');
http.createServer(function (req, res) {
	req.on('data', function(data) {
		processRequest(data);
	});

	req.on('close', function() {
		client.close();
	});

  	res.writeHead(200, {'Content-Type': 'text/plain'});
 	res.end('Cadastrado\n');
}).listen(1338, '127.0.0.1');


function processRequest(data) {
	info = data.toString();
	st = info.split("&");
	username = st[0].split('=')[1];
	password = st[1].split('=')[1];
	client.collection('users', register);
}

