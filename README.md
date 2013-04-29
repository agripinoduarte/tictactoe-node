# Jogo da Velha Online Multiplayer

## Introdução
O Jogo da Velha Multiplayer é um aplicativo web em HTML e JavaScript cujo server-side é desenvolvido em Node.js.
O núcleo do jogo no servidor utiliza WebSocket, para manter uma conexão constante entre cliente e servidor, utilizando
a extensão Socket.io. Os dadosdos jogadores são persistidos no banco de dados não-relacional MongoDB. 

## Requisitos
O aplicativo roda em qualquer sistema operacional onde o Node.js e MongoDB tenham suporte. Em geral, sistemas Unix (Linux,
BSD e MacOS) e Windows. Requisitos mínimos
	
	NodeJS 0.4.8
	MongoDB 2.4

## Instalação 

### Linux (Debian/Ubuntu) 
Para instalar o ambiente de execução do jogo, execute:

	sudo apt-get install nodejs npm mongodb

### Linux (Red Hat/Fedora/Suse)

Esse comando instalará o Node.js, o gerenciador de pacotes npm e o banco de dados MongoDB.
Descompacte o arquivo tictactoe.tar.gz. Entre no diretório tictactoe e execute
	
	npm install

para instalar as dependências.

Para iniciar a aplicação no servidor, execute

	node app <numero_da_porta>

Para acessar a aplicação, digite <nome_do_host>/<numero_da_porta>
