/*
 * GET registration page. 
 */
 exports.login = function(req, res) {
   res.render('register', { title: 'Cadastre-se Agora!'} );
};