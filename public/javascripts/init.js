combinations = new Array(
	[1,2,3],
	[4,5,6],
	[7,8,9],
	[1,5,9],
	[3,5,7],
	[1,4,7],
	[2,5,8],
	[3,6,9]
);

var GameInterface = {
	
	set: function(c_name, value) {
		sessionStorage.setItem(c_name, value);
	},

	get: function(name) {
		return sessionStorage.getItem(name);
	},

	getLoggedUser: function()
	{
		return sessionStorage.getItem('loggeduser');
	},

	getGameSession: function()
	{
		return sessionStorage.getItem('gamesessionid');
	},

	requestplay: function(e)
	{	
		socket.emit('requestplay', {sessionid: socket.socket.sessionid, userid: e.getAttribute('rel'), requesterid: this.getLoggedUser()});
	},
}

// classe Player
var Player = function(player) {
	this.id = null;
	this.userid = player._id;
	this.name = player.username;
	this.squares = [];

	this.checkWin = function () {
		squares = this.squares.sort(function(a,b) { return a - b});
		count = 0;

		if (squares.length == 3) {
			for (i = 0; i < combinations.length; i++) {	
				if (
					(squares[0] == combinations[i][0] &&
					squares[1] == combinations[i][1] && 
					squares[2] == combinations[i][2]) 
				)
					return true;
			}
		}

		if (squares.length == 4) {
			for (i = 0; i < combinations.length; i++) {	
				if (
					(squares[0] == combinations[i][0] &&
					squares[1] == combinations[i][1] && 
					squares[2] == combinations[i][2]) 
					|| 
					(squares[1] == combinations[i][0] &&
					squares[2] == combinations[i][1] && 
					squares[3] == combinations[i][2])
					||
					(squares[0] == combinations[i][0] &&
					squares[2] == combinations[i][1] && 
					squares[3] == combinations[i][2])
					||
					(squares[0] == combinations[i][0] &&
					squares[1] == combinations[i][1] && 
					squares[3] == combinations[i][2])
				)
					return true;
			}
		}

		if (squares.length == 5) {
			for (i = 0; i < combinations.length; i++) {
				if (
					(squares[0] == combinations[i][0] &&
					squares[1] == combinations[i][1] && 
					squares[2] == combinations[i][2]) 
					|| 
					(squares[1] == combinations[i][0] &&
					squares[2] == combinations[i][1] && 
					squares[3] == combinations[i][2])
					||
					(squares[2] == combinations[i][0] &&
					squares[3] == combinations[i][1] && 
					squares[4] == combinations[i][2])
					||
					(squares[1] == combinations[i][0] &&
					squares[2] == combinations[i][1] && 
					squares[4] == combinations[i][2])
					||
					(squares[1] == combinations[i][0] &&
					squares[3] == combinations[i][1] && 
					squares[4] == combinations[i][2])
					||
					(squares[0] == combinations[i][0] &&
					squares[2] == combinations[i][1] && 
					squares[4] == combinations[i][2])
					||
					(squares[0] == combinations[i][0] &&
					squares[3] == combinations[i][1] && 
					squares[4] == combinations[i][2])
					||
					(squares[0] == combinations[i][0] &&
					squares[2] == combinations[i][1] && 
					squares[4] == combinations[i][2])
					||
					(squares[0] == combinations[i][0] &&
					squares[2] == combinations[i][1] && 
					squares[3] == combinations[i][2])

				)
					return true;
			}
		}

		return false;
	};
};

var socket = io.connect('http://localhost:3000');
var gamesessionid;
var loggeduser = 0;

var user = {
	myShape: 'circle',
	setShape: function(shape) {
		this.myShape = shape;
	}
};

socket.on('connect', function () {
    GameInterface.set("sessionid", this.socket.sessionid);
    value = document.cookie.match(/loggeduser=[a-zA-Z0-9\%]+/);
	loggeduser = value[0].slice(18,42);
    sessionStorage.setItem('loggeduser', loggeduser);
});

socket.on('requestUser', function(data) {
	ok = confirm('O jogador "' + data.username + '" deseja jogar com você. Clique em OK para iniciar a partida');
	if (ok) {
		socket.emit('acceptGame', {requesterid: data.requesterid, userid: data.userid});
	}
});

socket.on('requestAccepted', function (data) {
	socket.emit('updateGameSession', {requesterid: data.requesterid, userid: data.userid});
	user.setShape('x');
});

socket.on('updateGameSessionCookie', function (data) {
	GameInterface.set('gamesessionid', data.gamesessionid);
	GameInterface.set('p1', data.p1);
	GameInterface.set('p2', data.p2);
	
		gamesessionid = data.gamesessionid;

	document.getElementById('userList').setAttribute('class', 'hidden');
	document.getElementById('layer').setAttribute('class', 'show');

	p1 = new Player(data.p1);
	p2 = new Player(data.p2);
	
	p1.id = 1;
	p2.id = 2;
});

