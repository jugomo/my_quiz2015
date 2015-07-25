// GET /login -- formulario de login
exports.new = function(req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render('sessions/new', { errors: errors });
};

// POST /login -- crear la sesion
exports.create = function(req, res) {
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user) {
    // si hay error retornamos mensajes de error de sesion
    if (error) {
      req.session.errors = [{ "message": 'Se ha producido un error: ' + error }];
      res.redirect("/login");
      return;
    }

    // crear req.session.user y guardar campos id y username
    // la sesion se define por la existencia de: req.session.user
    req.session.user = { id: user.id, username: user.username };

    // redirigir a path anterior a login
    res.redirect(req.session.redir.toString());
  });
};

// DELETE /logout -- destruir sesion
exports.destroy = function(req, res) {
  delete req.session.user;

  // redirigir a un path anterior a login
  res.redirect(req.session.redir.toString());
};