var mongo = require('mongodb');
var players = [];
var client = new mongo.Db('tictactoe', new mongo.Server("127.0.0.1", 27017, {}), {w: 1}),
test = function (err, collection) {
  collection.count(function(err, count) {

  });

  // Locate all the entries using find
  collection.find().toArray(function(err, results) {
    players = results;
  });
};

client.open(function(err, p_client) {
  client.collection('users', test);
});


var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

app.listen(1337);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
    id = socket.id;
    client.collection('users', test);
    socket.on('playermove', function (data) {
        content = JSON.parse(data);
        socket.emit('markmove', {type:content[0].type, x : content[0].x, y : content[0].y});
    });

    socket.on('reloadplayerlist', function() {
        client.collection('users', test);
        socket.emit('loadplayerlist', {playerlist: players});
    });

    loadplayerlist(socket);
});

loadplayerlist = function(socket) {
    socket.emit('loadplayerlist', {playerlist: players});
}

