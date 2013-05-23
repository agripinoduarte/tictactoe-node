/**
 * Module dependencies.
*/
var express = require('express'), 
routes = require('./routes'),  
user = require('./routes/user'),    
path = require('path'),
mongo = require('mongodb'),
crypto = require('crypto');


/// Instância principal da aplicação ExpressJS
var app = express();
var http = require('http').createServer(app);

//// Instância da conexão ao MongoDB
var client = new mongo.Db('tictactoe', new mongo.Server("localhost", 27017, {}), {w: 1});
client.open(function(err, p_client) {
	console.log('Conectado ao MongoDB');
    client.collection('users', function() {});
});


/// Variaveis de Ambiente
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

/// Definições do ExpressJS
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

/// Variáveis globais
var recentUserId = null;
var sockets = [];
var users = [];
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
            return true;          
        }
        return false;
    },
    get: function() {
        return this.list;
    },
    getById: function(id) {
        for (i = 0; i < this.list.length; i++) {
            if (this.list[i]._id == id) {
                return this.list[i];
            }
        }

        return null;
    }
}

var gamesessions = {
    sessions: [],

    add: function(userid, requesterid) {
        md = crypto.createHash('md5');
        md.update(userid + '-' + requesterid);
        id = md.digest('hex');
        this.sessions.push({
            id: id, 
            selfsocket: users[userid], 
            othersocket: users[requesterid], 
            userid: userid, 
            requesterid: requesterid
        });
        return id;
    },

    remove: function (session) {
        var index = this.sessions.indexOf(session);
        if (index != -1) {
            this.sessions.splice(index, 1);
            return true;          
        }
        return false;
    },

    getById: function (id) {
        for (i = 0; i < this.sessions.length; i++) {
            if (this.sessions[i].id == id) {
                return this.sessions[i];
            }
        }
        return false;
    },

    getByUserId: function(id) {
        for (i = 0; i < this.sessions.length; i++) {
            if (this.sessions[i].userid == id || this.sessions[i].requesterid == id) {
                return this.sessions[i];
            }
        }
    }

};

/// Rotas para as ações da aplicação
app.get('/', function(req, res) {
     if (req.cookies.loggeduser == 'false') {
        res.redirect('login');
    }

    recentUserId = req.cookies.loggeduser;
    user = userlist.getById(recentUserId);

    gamesession = gamesessions.getByUserId(recentUserId);
    
    if (gamesession != undefined) {
        gamesessions.remove(gamesession);
    }
       
    if (user != undefined) {
        userlist.remove(user);
        client.collection('users', function(err, collection) {
        collection.findOne({username: user.username}, function(err, result) { 
            if (result != null) {
                userlist.add(result);
            }
        });
     });
    }

    logged = true;
    res.render('index', { title: 'Jogo da Velha Multiplayer', userList: userlist.get(), logged: logged});
});

app.get('/register', function(req, res) {
	res.render('register', {title: "Cadastro"});
});

app.post('/register', function(req, res) {
	client.collection('users', function(err, collection) {
		collection.save(req.body, function() {});
	});

	res.redirect('/');
});

app.get('/login', function(req, res) {
	res.render('login', {title: "Autenticação"});
});

app.get('/game', function(req, res) {
    res.render('game', {title: "Novo Jogo"});
});

app.get('/logout', function(req, res) {
    res.cookie("loggeduser", false);
    res.redirect('/');
    user = userlist.getById(req.cookies.loggeduser);

    userlist.remove(user);
});

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


/// Instância principal do Socket.io
var io = require('socket.io').listen(http);

io.sockets.on('connection', function (socket) {
	console.log('Executando Socket.io');
    sockets[socket.id] = socket;
    users[recentUserId] = socket;
   
    /// Gerenciamento dos eventos dos usuários

    // Clique do jogador na casa do tabuleiro
    socket.on('playermove', function (data) {  
        gamesession = gamesessions.getById(data.gamesessionid);
        if (gamesession.selfsocket != undefined) {
            gamesession.selfsocket.emit('mark', {x: data.x, y: data.y, type: data.type});    
        }

        if (gamesession.othersocket != undefined) {
            gamesession.othersocket.emit('mark', {x: data.x, y: data.y, type: data.type});
        }
    });

    // Solicitação de jogo
    socket.on('requestplay', function (data) {
        sock = users[data.userid];
        user = userlist.getById(data.requesterid);
        sock.emit('requestUser', {username: user.username, userid: user._id, requesterid: data.userid});
    });

    // Aceite de solicitação de jogo 
    socket.on('acceptGame', function(data) {
        sock = users[data.requesterid]; 
        gamesessionid = gamesessions.add(data.userid, data.requesterid);
        sock = users[data.userid];
        otherSock = users[data.requesterid];

        sock.emit('updateGameSessionCookie', {gamesessionid: gamesessionid});
        otherSock.emit('updateGameSessionCookie', {gamesessionid: gamesessionid});
        sock.emit('requestAccepted', {userid: data.userid, requesterid: data.requesterid, shape: 'x'});
    });

    // Limpar tabuleiro
    socket.on('clearBoard', function(data) {
        gamesession = gamesessions.getById(data.gamesessionid);

        if (gamesession.selfsocket != undefined) {
            gamesession.selfsocket.emit('clearAllBoards', {});    
        }

        if (gamesession.othersocket != undefined) {
            gamesession.othersocket.emit('clearAllBoards', {}); 
        }
    });
});


// Servidor HTTP do ExpressJS
http.listen(app.get('port'), function(){
    console.log('Servidor ExpressJS executando em ' + app.get('port'));
});
