// controlador para la gestion de usuarios

var users = {
  admin: { id: 1, username: "admin", password: "1234" },
  pepe:  { id: 2, username: "pepe", password: "5678" }
};

// comprobar si un usuario esta registrado en users
// si la autenticacion falla o hay errores, se ejecuta callback(error)
exports.autenticar = function(login, password, callback) {
  if (users[login]) {
    if (password === users[login].password) {
      callback(null, users[login]);
    } else {
      callback(new Error('Password erroneo.'));
    }
  } else {
    callback(new Error('No existe el usuario.'));
  }
};
