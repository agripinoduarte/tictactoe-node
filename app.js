3/**
 * Module dependencies.
*/

if (process.argv[2] == undefined) {
    console.log('Informe o número da porta')
    process.exit();
}

var express = require('express'), 
routes = require('./routes'),  
user = require('./routes/user'),    
path = require('path'),
mongo = require('mongodb');

// Iniciando Aplicação
var app = express();
var http = require('http').createServer(app);

//// Conexão ao MongoGB
var client = new mongo.Db('tictactoe', new mongo.Server("localhost", 27017, {}), {w: 1});
client.open(function(err, p_client) {
	console.log("MongoDB Connected");
    client.collection('users', function() {});
});


// Variaveis de Ambiente
app.set('port', process.env.PORT || process.argv[2]);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());  
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var recentUserId = null;
var sockets = [];
var users = [];

// Somente Desenvolvimento 
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

var userlist = {
    list: [],
    add: function(user) {
        this.list.push(user);
        // io.sockets.emit('user-list', {
        //     'users': this.list
        // });
    },
    remove: function(user) {
        var index = this.list.indexOf(user);
        if (index != -1) {
            this.list.splice(index, 1);
            io.sockets.emit('user-list', {
                'users': this.list
            });
            return true;          
        }
        return false;
    },
    get: function() {
        return this.list;
    }
}

///// Rotas
app.get('/', function(req, res) {
     if (req.cookies.loggeduser == 'false') {
        res.redirect('login');
    }

    recentUserId = req.cookies.loggeduser;
    logged = true;
    console.log(userlist.get());
    res.render('index', { title: 'Jogo da Velha Multiplayer', userList: userlist.get(), logged: logged});
});

app.get('/register', function(req, res) {
	res.render('register', {title: "Cadastro"});
});

app.post('/register', function(req, res) {
	client.collection('users', function(err, collection) {
		collection.save(req.body, function() {
		});
	});

	res.redirect('/');
});

app.get('/login', function(req, res) {
	res.render('login', {title: "Autenticação"});
});

app.get('/game', function(req, res) {
    client.collection('gamesessions', function(err, collection) {
        res.render('game', {session: r, title: 'Novo Jogo', logged: logged});
    });
});

app.get('/gamesession', function(req, res) {
    user = req.user;    
});

app.get('/logout', function(req, res) {
    res.cookie("loggeduser", false);
    res.redirect('/');
});


// Socket.io
var io = require('socket.io').listen(http);

app.post('/login', function(req, res) {
    var request = req;
     client.collection('users', function(err, collection) {
        collection.findOne({username: request.body.user.username}, function(err, result) { 
            if (result != null && request.body.user.password == result.password) {
                recentUserId = result._id;
                userlist.add(result);
                res.cookie("loggeduser", result._id);
                res.redirect('/');
            } else {
                res.redirect('register');
            }
        });
     });
});

io.sockets.on('connection', function (socket) {
	console.log("Socket.io running");
    sockets[socket.id] = socket;
    users[recentUserId] = socket;
    // Eventos
    socket.on('playermove', function (data) {
    });

    socket.on('requestplay', function (data) {
        socket = users[data.userid];
        socket.emit('requestuser');
    });
});


// Servidor HTTP
http.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
