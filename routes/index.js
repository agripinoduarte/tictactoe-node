/*
 * GET home page. 
 */
 exports.index = function(req, res) {
 	console.log(req.cookies);
 	logged = true;
 	res.render('index', { title: 'Jogo da Velha Multiplayer', logged: logged});
};