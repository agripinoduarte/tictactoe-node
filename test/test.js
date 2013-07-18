var express = require('express'), 
net = require('net'),
path = require('path'),
mongo = require('mongodb'),
socket = new net.Socket(),
crypto = require('crypto');
var request = require('request');

/// Instância principal da aplicação ExpressJS
var app = express();
var assert = require('assert');
var io = require('../node_modules/socket.io/node_modules/socket.io-client');
var sock = io.connect('http://localhost:3000');

module.exports = { 
	testConnection: function() {
		console.log('Test Connection');
		request.post(
		    'http://localhost:3000/login',
		    { form: { "user[username]": 'jose', "user[password]": 'senha' } },
		    function (error, response, body) {
		    	console.log(body);
		        if (!error && response.statusCode == 200) {
		            console.log('ok')
		        }
		    }
		);
	},
	testInit: function() {
		console.log('testInit');
		var t = new Date();
		console.log(t.getTime());
		sock.emit('playermove', {gamesessionid: '123456'});
		sock.emit('requestplay', {userid: '51d8b4506d22267720000002', requesterid: '51d8b45c6d22267720000003'});
		socket.on('requestUser', function() { console.log(t.getTime());});
 	}
}
