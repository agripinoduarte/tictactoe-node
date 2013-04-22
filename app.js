/**
 * Module dependencies.
*/

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
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());  
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Somente Desenvolvimento 
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

///// Rotas
app.get('/', routes.index);
app.get('/register', function(req, res) {
	res.render('register', {title: "Cadastro"});
});

app.post('/register', function(req, res) {
	client.collection('users', function(err, collection) {
		collection.save(req.body, function() {
			console.log('Salvo');
		});
	});

	res.redirect('/');
});

app.get('/login', function(req, res) {
	res.render('login', {title: "Autenticação"});
});

app.post('/login', function(req, res) {
	 client.collection('users', function(err, collection) {
	 	collection.findOne({username: req.body.username}, function(err, result) { 
            if (result != null) {
                if (req.body.password == result.password) {
                    logged = true;
                    res.redirect('/');
                    res.cookie("loggeduser", true);
                }
            }
            res.redirect('register');
        });
	 });
});

// Servidor HTTP
http.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});


// Socket.io
var io = require('socket.io').listen(http);
io.sockets.on('connection', function (socket) {
	console.log("Socket.io running");
    // Eventos
    socket.on('playermove', function (data) {
    	console.log("move");
    });

});