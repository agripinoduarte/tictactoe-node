var socket = io.connect('http://localhost:3000');

socket.on('requestuser', function() {
	alert("oi");
});

socket.on('connect', function () {
    setCookie("sessionid", this.socket.sessionid, 2);
});

//

function setCookie(c_name, value, exdays)
{
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}

function getCookie(name)
{
	cookie = document.cookie;

	value = cookie.match(/sessionid=[a-zA-Z0-9]+/);
	console.log(value[0]);
}

function requestplay(e)
{
	socket.emit('requestplay', {sessionid: socket.socket.sessionid, userid: e.getAttribute('rel')});
}