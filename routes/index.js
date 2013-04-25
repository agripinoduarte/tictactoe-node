/*
 * GET home page. 
 */
 exports.index = function(req, res) {
 	if (req.cookies.loggeduser == 'false') {
 		res.redirect('login');
 	}
 	logged = true;
 	res.render('index', { title: 'Jogo da Velha Multiplayer', logged: logged});
};