var socket = io.connect('http://localhost:3000');

var user = {
	myShape: 'circle',
	setShape: function(shape) {
		this.myShape = shape;
	}
};

socket.on('requestUser', function(data) {
	ok = confirm('O jogador "' + data.username + '" deseja jogar com você. Clique em OK para iniciar a partida');
	if (ok) {
		socket.emit('acceptGame', {requesterid: data.requesterid, userid: data.userid});
	}
});

socket.on('connect', function () {
    setCookie("sessionid", this.socket.sessionid, 2);
});

socket.on('requestAccepted', function (data) {
	socket.emit('updateGameSession', {requesterid: data.requesterid, userid: data.userid});
	user.setShape('x');
});

socket.on('updateGameSessionCookie', function (data) {
	setCookie('gamesessionid', data.gamesessionid, 2);
});


function setCookie(c_name, value, exdays)
{
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}

function getLoggedUser()
{
	value = document.cookie.match(/loggeduser=[a-zA-Z0-9\%]+/);
	loggeduser = value[0].slice(18,42);
	return loggeduser;
}

function getGameSession()
{
	value = document.cookie.match(/gamesessionid=[a-zA-Z0-9\%]+/);
	gamesessionid = value[0].slice(14);
	return gamesessionid;
}

function requestplay(e)
{	
	socket.emit('requestplay', {sessionid: socket.socket.sessionid, userid: e.getAttribute('rel'), requesterid: getLoggedUser()});
}

