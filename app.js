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
    //console.log("1 " + req.path);
  }

  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = '/';
    //req.session.redir = req.path;
    //console.log("2 " + req.path);
  }

  // copiar la sesion para hacerla accesible en las vistas
  res.locals.session = req.session;
  next();
});

// instalar enrutadores
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
