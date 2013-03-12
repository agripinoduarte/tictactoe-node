/*
Para fins ilustrativos: segue o numero de casa posicao no tabuleiro
1 | 2 | 3
---------
4 | 5 | 6
---------
7 | 8 | 9
*/
//vars - variavel usada para manter o estado do tabuleiro. ela eh uma instancia da classe Tabuleiro
var tabuleiro;

//constantes - tem as imagens que serao desenhadas
const imgBola = new Image();
imgBola.src = 'BOLA-verde.jpg';
const imgX = new Image();
imgX.src = 'X-vermelho.jpg';

//classe Ponto - classe auxiliar usada para manter as coordenadas x,y do elemento canvas
var Ponto = Class.create();
Ponto.prototype = {
 initialize: function(x, y) { //construtor
  this.setX(x);
  this.setY(y);
 },
 setX: function(x) {
  this.x = x;
 },
 setY: function(y) {
  this.y = y;
 }
}


//classe Tabuleiro - classe que contem boa parte do funcionamento do jogo
var Tabuleiro = Class.create();
Tabuleiro.prototype = {
 initialize: function(canvasId) { //construtor passando o id da dom do componente canvas
  var canvas = document.getElementById(canvasId); //obtem o componente
  this.setCanvas(canvas);
                //redimensiona o canvas
  this.canvas.width = 300;
  this.canvas.height= 300;
                //no canvas temos que obter o contexto para manipula-lo
                //neste caso, o contexto é 2d
  this.setContext(canvas.getContext('2d'));
                //as posicoes do tabuleiro (sao 9 posicoes, usei um array de 10 para facilitar)
  this.setPosicoes(new Array(10));
                //sao 2 jogadores : true[x vermelho] e false[bola verde]
  this.setJogadorAtivo(true); 
                //desenha as 4 linhas do tabuleiro
  this.desenhar();
                //faz o bind do onclick do canvas com a function main
                //ou seja, toda vez que alguem clicar no canvas, o main sera executado
  Event.observe(canvasId, 'click', function(event) {
   return main(tabuleiro, event);
  });
 },
 setCanvas: function(canvas) {
  this.canvas = canvas;
 },
 setContext: function(context) {
  this.context = context;
 },
 setPosicoes: function(posicoes) {
  this.posicoes = posicoes;
 },
 setJogadorAtivo: function(jogadorAtivo) {
  this.jogadorAtivo = jogadorAtivo;
 },
 desenhar: function() {
                //a função fillRect desenha um retangulo
                //com dimensoes (100,10) e aloca na posicao (5,300)
  this.context.fillRect(100,10,5,300);
                //dimensao (200,10) posicao (5,300)
  this.context.fillRect(200,10,5,300);
                //dimensao (10,100) posicao (300,5)
  this.context.fillRect(10,100,300,5);
                //dimensao (10,200) posicao (300,5)
  this.context.fillRect(10,200,300,5);
 },
/*
Para fins ilustrativos: segue o numero de casa posicao no tabuleiro
1 | 2 | 3
---------
4 | 5 | 6
---------
7 | 8 | 9
*/
        //a função venceu verificara se houve um vencedor na rodada
        //para isso, ele chama a function 'igual' passando um array de 3 posicoes
        //para ver se essas 3 posicoes possuem o mesmo valor do jogadorAtivo (o atual)
        //a função 'igual' é usada para realizar esta comparacao
 venceu: function() {
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
 },
        //faz a comparacao com as posicoes passadas pelo array com o jogadorAtivo
        //se todas as posicoes tiverem sido marcadas pelo jogadorAtivo, retorna true
 igual: function(array) {
  var retorno = true;
  for (var i in array) {
   if (this.posicoes[i] != this.jogadorAtivo) {
    retorno = false;
    break;
   }
  }
  return retorno;
 },
        //função usada para obter a coordenada (x,y) do lugar onde houve o clique do mouse
        //vale lembrar que ele exibe a coordenada do canvas, e não do html
        //por isso que houve a necessidade desta função
 posicaoCursor: function(e) {
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
 },
 /*
 1 de (0,0)   até (99,99)  ; 2 de (106,0)  até (199,99) ; 3 de (206,0)     até (299,99)
 4 de (0,106) até (99,199) ; 5 de (106,199)  até (199,199) ; 6 de (206,199) até (299,199)
 7 de (0,206) até (99,299) ; 8 de (106,206)   até (199,299) ; 9 de (206,206) até (299,299) 
 */
//função auto-explicativa
 obterQuadradoSelecionado: function(ponto) {
  if (ponto.x >=0 && ponto.x <=99) { //1, 4 ou 7
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
 },
        //função que desenha uma bola verde na coordenada definida por 'ponto'
 marcarBola: function(context, ponto) {
  context.drawImage(imgBola, ponto.x, ponto.y);
 },
        //função que desenha um x vermelho na coordenada definida por 'ponto'
 marcarX: function(context, ponto) {
  context.drawImage(imgX, ponto.x, ponto.y);
 },
        //função que marca a jogada realizada pelo jogadorAtivo
        //ela recebe como parametro o numero do 'quadrado' que foi clicado,
        //essa posicao é marcada no array,
        //a variavel 'marcar' é executada para desenhar uma bola verde ou um x vermelho,
        //dependendo do jogadorAtivo no momento
 marcarJogada: function(number){
  this.posicoes[number] = this.jogadorAtivo;
  var marcar = this.jogadorAtivo ? this.marcarX : this.marcarBola;
  if (number == 1) {
   marcar(this.context, new Ponto(30, 30));
  } else if (number == 2) {
   marcar(this.context, new Ponto(130, 30));
  } else if (number == 3) {
   marcar(this.context, new Ponto(230, 30));
  } else if (number == 4) {
   marcar(this.context, new Ponto(30, 130));
  } else if (number == 5) {
   marcar(this.context, new Ponto(130, 130));
  } else if (number == 6) {
   marcar(this.context, new Ponto(230, 130));
  } else if (number == 7) {
   marcar(this.context, new Ponto(30, 230));
  } else if (number == 8) {
   marcar(this.context, new Ponto(130, 230));
  } else if (number == 9) {
   marcar(this.context, new Ponto(230, 230));
  }
 }
}

//metodo com a regra do jogo
function main(tabuleiro, event) {
        //obtemos o quadrado que foi clicado
 var quadrado = tabuleiro.obterQuadradoSelecionado(tabuleiro.posicaoCursor(event));
        //se a posicao ainda nao foi marcada
 if (tabuleiro.posicoes[quadrado] == null) {
                //eh feita a jogada
  tabuleiro.marcarJogada(quadrado);
                //houve um vencedor? se sim, notifique. se nao, mudamos o jogadorAtivo
  if (tabuleiro.venceu(tabuleiro.jogadorAtivo)) {
   alert('Jogador ' + (tabuleiro.jogadorAtivo ? 'xis vermelho' : 'bola verde') + ' venceu!');
   tabuleiro.setPosicoes(null);
  } else {
   tabuleiro.setJogadorAtivo(!tabuleiro.jogadorAtivo);
  }
 }
}
