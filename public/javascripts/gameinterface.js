window.onload = novo;
var gamesessionid = GameInterface.getGameSession();
var tabuleiro, p1, p2, currentPlayer;

/////////////////////// Observers /////////////////////
socket.on('clearAllBoards', reload);

/////////////////////// Funções //////////////////////
function clearBoard() {
	socket.emit('clearBoard', {gamesessionid: gamesessionid});
}

function clear() {
	sessionStorage.removeItem('gamesessionid');
	tabuleiro.limpaTabuleiro();
	p1.squares = [];
	p2.squares = [];
	currentPlayer = [];
}

function endGame() {
	sessionStorage.removeItem('gamesessionid');
	window.location.reload(true);
}

function reload() {
	clear();
}

function novo() {
	delete tabuleiro;
	delete p1;
	delete p2;
	delete currentPlayer;

	var player1 = GameInterface.get('p1');
	var player2 = GameInterface.get('p2');

	tabuleiro = new Tabuleiro('velha');
}


//classe Ponto
var Ponto = function(x, y) {
	this.setX = function(x) {
		this.x = x;
	};

	this.setY = function(y) {
		this.y = y;
	}

	this.setX(x);
	this.setY(y);
};


//classe Tabuleiro
var Tabuleiro = function(canvasId) {
	this.posicoes = [null, null, null, null, null, null, null, null, null];

	this.setCanvas = function(canvas) {
		this.canvas = canvas;
	};

	this.setContext = function(context) {
		this.context = context;
	};

	this.setPosicoes = function(posicoes) {
		for (var i = this.posicoes.length - 1; i >= 0; i--) {
			this.posicoes[i] = null;
		};
	};

	this.setJogadorAtivo = function(jogadorAtivo) {
		this.jogadorAtivo = jogadorAtivo;
	},

	this.desenhar = function() {
		this.context.fillRect(100,10,5,300);
		this.context.fillRect(200,10,5,300);
		this.context.fillRect(10,100,300,5);
		this.context.fillRect(10,200,300,5);
	};

	this.venceu = function() {
		if (this.igual([1,2,3])) {
			return true;

		} else if (this.igual([4,5,6])) {
			return true;
		} else if (this.igual([7,8,9])) {
			return true;
		} else if (this.igual([1,4,7])) {
			return true;
		} else if (this.igual([2,5,8])) {
			return true;
		} else if (this.igual([3,6,9])) {
			return true;
		} else if (this.igual([1,5,9])) {
			return true;
		} else if (this.igual([3,5,7])) {
			return true;
		} else {
			return false;
		}
	};

	this.igual = function(array) {
		var retorno = true;
		for (i = 0; i < array.length; i++) {
			if (this.posicoes[array[i]] != this.jogadorAtivo) {
				retorno = false;
				break;
			}
		}
		return retorno;
	};

	this.posicaoCursor = function(e) {
		var x;
		var y;
		if (e.pageX || e.pageY) {
		  x = e.pageX;
		  y = e.pageY;
		} else {
		  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		x -= this.canvas.offsetLeft;
		y -= this.canvas.offsetTop;
		return new Ponto(x,y);
	};

	/*
	1 de (0,0)  	até (99,99)		; 2 de (106,0) 	até (199,99)	; 3 de (206,0)    	até (299,99)
	4 de (0,106) até (99,199)	; 5 de (106,199) 	até (199,199)	; 6 de (206,199)	até (299,199)
	7 de (0,206) até (99,299)	; 8 de (106,206)  	até (199,299)	; 9 de (206,206)	até (299,299)	
	*/
	this.obterQuadradoSelecionado = function(ponto) {
		if (ponto.x >= 0 && ponto.x <=99) { //1, 4 ou 7
			if (ponto.y >=0 && ponto.y <= 99) {
				return 1;
			} else if (ponto.y >= 106 && ponto.y <= 199) {
				return 4;
			} else if (ponto.y >= 206 && ponto.y <= 299) {
				return 7;
			} 
		} else if (ponto.x >=106 && ponto.x <=199) { //2, 5 ou 8
			if (ponto.y >=0 && ponto.y <= 99) {
				return 2;
			} else if (ponto.y >= 106 && ponto.y <= 199) {
				return 5;
			} else if (ponto.y >= 206 && ponto.y <= 299) {
				return 8;
			} 
		} else if (ponto.x >=206 && ponto.x <=299) { //3, 6 ou 9
			if (ponto.y >=0 && ponto.y <= 99) {
				return 3;
			} else if (ponto.y >= 106 && ponto.y <= 199) {
				return 6;
			} else if (ponto.y >= 206 && ponto.y <= 299) {
				return 9;
			} 
		} else {
			return null;
		}
	};

	this.marcarBola = function(context, ponto) {
		context.beginPath();
		context.fillStyle = "#00B060";
		context.arc(ponto.x+20, ponto.y+20, 35, 0,Math.PI*2,true); // Outer circle
		context.moveTo(0,0);
		context.stroke();
		context.fill();
	};

	this.marcarX = function(context, ponto) {
		context.beginPath();

		context.moveTo(ponto.x - 10, ponto.y - 20);
		context.lineTo(ponto.x + 45, ponto.y + 55);
		context.moveTo(ponto.x + 45, ponto.y - 20);
		context.lineTo(ponto.x - 10, ponto.y + 55);
		context.stroke();
	};

	this.limpaTabuleiro = function() {
		this.setPosicoes(null);
		this.context.fillStyle = "#FFFFFF";
		this.context.fillRect(10,10,90,90);
		this.context.fill();
		this.context.fillRect(105,10,95,90);
		this.context.fill();
		this.context.fillRect(205,10,95,90);
		this.context.fill();
		
		this.context.fillRect(10,105,90,95);
		this.context.fill();
		this.context.fillRect(105,105,95,95);
		this.context.fill();
		this.context.fillRect(205,105,95,95);
		this.context.fill();

		this.context.fillRect(10,205,90,95);
		this.context.fill();
		this.context.fillRect(105,205,95,95);
		this.context.fill();
		this.context.fillRect(205,205,95,95);
		this.context.fill();
	};

	this.marcarJogada = function(number){
		this.posicoes[number] = this.jogadorAtivo;

		if (gamesessionid != undefined) {
			var marcar = user.myShape == 'x' ? this.marcarX : this.marcarBola;
		} else {
			var marcar = this.jogadorAtivo ? this.marcarX : this.marcarBola;
			var bot = this.jogadorAtivo ? this.marcarBola : this.marcarX;
		}

		// bot que marca posições aleatórias
		pos = [30, 130, 230];
		rX = pos[Math.floor(Math.random() * 3)];
		rY = pos[Math.floor(Math.random() * 3)];

		if (number == 1) {
			marcar(this.context, ponto = new Ponto(30, 30));
		} else if (number == 2) {
			marcar(this.context, ponto = new Ponto(130, 30));
		} else if (number == 3) {
			marcar(this.context, ponto = new Ponto(230, 30));
		} else if (number == 4) {
			marcar(this.context, ponto = new Ponto(30, 130));
		} else if (number == 5) {
			marcar(this.context, ponto = new Ponto(130, 130));
		} else if (number == 6) {
			marcar(this.context, ponto = new Ponto(230, 130));
		} else if (number == 7) {
			marcar(this.context, ponto = new Ponto(30, 230));
		} else if (number == 8) {
			marcar(this.context, ponto = new Ponto(130, 230));
		} else if (number == 9) {
			marcar(this.context, ponto = new Ponto(230, 230));
		}

		socket.emit('playermove', {
			square: number, 
			x: ponto.x, 
			y : ponto.y, 
			type : user.myShape, 
			gamesessionid: gamesessionid, 
			userid: GameInterface.getLoggedUser()
		});
	};

	var e;
	var canvas = document.getElementById(canvasId);
	this.setCanvas(canvas);
	this.canvas.width = 300;
	this.canvas.height= 300;
	this.setContext(canvas.getContext('2d'));
	this.setPosicoes(new Array(10));
	this.setJogadorAtivo(true);
	this.desenhar();
	
	canvas.onclick = function(e) {
		return main(tabuleiro, e);
	};

	socket.on('mark', function(data) {
		ponto = new Ponto(data.x, data.y);
		if (data.type == 'circle') {
			tabuleiro.marcarBola(tabuleiro.context, ponto);
		} else {
			tabuleiro.marcarX(tabuleiro.context, ponto);
		}

		if (data.userid == p1.userid) {
			currentPlayer = p1;
		}

		if (data.userid == p2.userid) {
			currentPlayer = p2;
		}

		currentPlayer.squares.push(data.square);

		if(currentPlayer.checkWin()) {
			alert('Jogador ' + currentPlayer.name + '  venceu');
			p1.squares = [];
			p2.squares = [];
			currentPlayer = [];
		} 
		
		// currentPlayer = currentPlayer.id == p1.id ? p2 : p1; 
	});
}

//metodo com a regra do jogo
function main(tabuleiro, event) {
	var quadrado = tabuleiro.obterQuadradoSelecionado(tabuleiro.posicaoCursor(event));
	if (tabuleiro.posicoes[quadrado] == null) {
		tabuleiro.marcarJogada(quadrado);	
		// currentPlayer.squares.push(quadrado);
		
		if (currentPlayer != undefined && currentPlayer.checkWin()) {
			alert('Jogador ' + currentPlayer.id + '  venceu');
			tabuleiro.setPosicoes(null);
		} 

		if (tabuleiro.venceu(tabuleiro.jogadorAtivo)) {
			alert('Jogador ' + (tabuleiro.jogadorAtivo ? 'xis vermelho' : 'bola verde') + ' venceu!');
			tabuleiro.setPosicoes(null);
		} else {
			tabuleiro.setJogadorAtivo(!tabuleiro.jogadorAtivo);
		}	

		// currentPlayer = currentPlayer.id == p1.id ? p2 : p1; 
	}
}