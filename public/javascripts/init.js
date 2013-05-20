var socket = io.connect('http://localhost:3000');

var user = {
	myShape: 'circle',
	setShape: function(shape) {
		this.myShape = shape;
	}
};

socket.on('connect', function () {
    setCookie("sessionid", this.socket.sessionid, 1);
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
	setCookie('gamesessionid', data.gamesessionid, 1);
});


function setCookie(c_name, value, exdays)
{
	sessionStorage.setItem(c_name, value);
	// var exdate = new Date();
	// exdate.setDate(exdate.getDate() + exdays);
	// var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	// document.cookie = c_name + "=" + c_value;
}

function getLoggedUser()
{
	return sessionStorage.getItem('loggeduser');
	// value = document.cookie.match(/loggeduser=[a-zA-Z0-9\%]+/);
	// loggeduser = value[0].slice(18,42);
	// return loggeduser;
}

function getGameSession()
{

	return sessionStorage.getItem('gamesessionid');
	// value = document.cookie.match(/gamesessionid=[a-zA-Z0-9\%]+/);

	// if (value !== null) {
	// 	gamesessionid = value[0].slice(14);
	// 	return gamesessionid;	
	// }	

	// return '';	
}

function requestplay(e)
{	
	socket.emit('requestplay', {sessionid: socket.socket.sessionid, userid: e.getAttribute('rel'), requesterid: getLoggedUser()});
}