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


var socket = io.connect('http://localhost:3000');

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
	document.getElementById('userList').setAttribute('class', 'hidden');
	document.getElementById('layer').setAttribute('class', 'show');
});

