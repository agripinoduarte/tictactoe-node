var mongo = require('mongodb');
var players = [];
var client = new mongo.Db('tictactoe', new mongo.Server("127.0.0.1", 27017, {}), {w: 1});
var connections = [];

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

app.listen(1337);


// abre a conexão com o MongoDB
client.open(function(err, p_client) {
    client.collection('users', getAll);
});


// inicia o WebSocket servidor
io.sockets.on('connection', function (socket) {
    var isLogged = false;
    connections[socket.id] = socket;

    // Eventos
    socket.on('playermove', function (data) {
        content = JSON.parse(data);
        players.forEach(function (e) {
            if (e._id == content[0].playerId) {
                connections[e.conn].emit('markmove', {type:content[0].type, x : content[0].x, y : content[0].y});
            }
             connections[e.conn].emit('markmove', {type:content[0].type, x : content[0].x, y : content[0].y});
        });
    });

    socket.on('reloadplayerlist', function() {
        socket.emit('loadplayerlist', {playerlist: players, isLogged: true});
    });

    socket.on('login', function(data) {
        client.collection('users', function(err, collection) {
            content = JSON.parse(data);
            collection.findOne({username: content[0].username}, function(err, result) { 
                if (result != null) {
                    if (content[0].password == result.password) {
                        result.conn = socket.id;
                        collection.save(result, function() {console.log('');});
                        players.push(result);
                        isLogged = true;
                        loadplayerlist(socket);
                        socket.emit('isLogged', {});
                    }
                }
            });
            
        })
    });

});

loadplayerlist = function(socket) {
    socket.emit('loadplayerlist', {playerlist: players, isLogged: true});
}

var handler = function (req, res) {
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

// função para buscar registros no banco
getAll = function (err, collection) {
    collection.count(function(err, count) {});

    // Locate all the entries using find
    collection.find().toArray(function(err, results) {
        // players = results;
    });
};

