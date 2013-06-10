var express = require('express'), 
net = require('net'),
path = require('path'),
mongo = require('mongodb'),
socket = new net.Socket(),
crypto = require('crypto');

/// Instância principal da aplicação ExpressJS
var app = express();
var assert = require('assert');
var io = require('../node_modules/socket.io/node_modules/socket.io-client');
var sock = io.connect('http://localhost:3000');

module.exports = { 
	testConnection: function() {
		console.log('test1');
	},
	testInit: function() {
		console.log('test2');
		sock.emit('playermove', {gamesessionid: '123456'});
		sock.emit('requestplay', {userid: '519bb6380c703ee723000001', requesterid: '51993e19da5ccea723000001'});
 	}
}
