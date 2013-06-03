var express = require('express'), 
net = require('net'),
path = require('path'),
mongo = require('mongodb'),
socket = new net.Socket(),
crypto = require('crypto'),
sock;


/// Instância principal da aplicação ExpressJS
var app = express();
var assert = require('assert');
// var http = require('http').createServer(app);
var io = require('../node_modules/socket.io/lib/socket.io.js');

module.exports = { 
	testConnection: function() {
		sock = io.connect('http://localhost:3000');
	},
	testInit: function() {
		sock.emit('playermove', {gamesessionid: '123456'});
	}
}