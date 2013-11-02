# Jogo da Velha Online Multiplayer

## Introdução
O Jogo da Velha Multiplayer é um web app em HTML5 e JavaScript com server-side desenvolvido em Node.js + ExpressJS.
O núcleo do jogo no servidor utiliza o protocolo WebSocket para manter uma sessão entre cliente e servidor utilizando
a extensão Socket.io. Os dados dos jogadores são persistidos no banco de dados não-relacional MongoDB. 

## Requisitos
O aplicativo roda em qualquer sistema operacional suportado pelo Node.js e MongoDB (Linux, MacOS e Windows). Requisitos mínimos
	
	NodeJS > 0.4.8
	MongoDB > 2.4

## Instalação 

### Linux (Debian/Ubuntu) 
Para instalar o ambiente de execução do jogo, execute:

	sudo apt-get install nodejs npm mongodb

Esse comando instalará o Node.js, o gerenciador de pacotes npm e o banco de dados MongoDB.
Descompacte o arquivo tictactoe.tar.gz. Entre no diretório tictactoe e execute
	
	npm install

para instalar as dependências.

Para iniciar a aplicação no servidor, execute

	node app

Para acessar a aplicação localmente acesse http://locahost:3000
