/*
 * GET registration page. 
 */
 exports.register = function(req, res) {
   res.render('register', { title: 'Cadastre-se Agora!'} );
};