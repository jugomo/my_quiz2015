// importar paquetes
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials')
var methodOverride = require('method-override');
var session = require('express-session');

//importar enrutadores
var routes = require('./routes/index');

// crear aplicacion
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// instalar middlewares
app.use(partials());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// helpers dinamicos:
app.use( function(req, res, next) {
  // guardar ruta de cada solicitud para redireccionar a vista
  // anterior despues de login o logout

  if (!req.session.redir) {
    req.session.redir = '/';
  }

  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // copiar la sesion para hacerla accesible en las vistas
  res.locals.session = req.session;
  next();
});

// instalar enrutadores
app.use('/', function(req, res, next) {
  var now = new Date();
  var stamp = req.session.time ? new Date(req.session.time) : new Date();

  if (!req.path.match(/\/login|\/logout/)) {
    // validamos tiempo ultima peticion > 2 minutos
    if ((now.getMinutes() - 1) > stamp.getMinutes()) {
      delete req.session.user;
      var errors = [{"message" : 'Sesión caducada. Debe volver a loguearse en el sistema para poder continuar.'}];
      req.session.errors = {};
      console.log("SESION CADUCADA. now: " + (now.getMinutes() - 1) + " stamp: " + stamp.getMinutes());
      res.render('sessions/new', {
        errors: errors
      });
    } else {
      // refrescamos tiempo ultima peticion
      req.session.time = new Date();
      console.log("SESION REFRESCADA: " + req.session.time);
      req.session.errors = {};
      next();
    }
  } else {
    next();
  }
}, routes);

app.use('/', routes);

// resto de rutas: generar error 404
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});

// exportar app para comando de arranque
module.exports = app;
