// importar el modelo para poder acceder a la BD
var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye .quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(function(quiz) {
    if (quiz) {
      req.quiz = quiz;
      next();
    } else {
      next(new Error('No existe quizId=' + quizId));
    }
  }).catch(function(error) { next(error); });
};

// GET /quizes (con gestion de errores)
exports.index = function(req, res) {
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index.ejs', { quizes: quizes, errors: [] });
  }).catch(function(error) { next(error); })
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: [] });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrexto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] });
};

// GET /quizes/new
exports.new = function(req, res) {
  // crea un objeto quiz
  var quiz = models.Quiz.build(
      { pregunta: "Pregunta", respuesta: "Respuesta" }
  );
  res.render('quizes/new', { quiz: quiz, errors: [] });
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);

  // validar la creacion y redirigir en funcion de resultado
  var errors = quiz.validate();
  if (errors) {
    var i = 0; var errores = new Array();
    for (var prop in errors) {
      errores[i++] = {message: errors[prop]};
      //console.log(errors[prop]);
    }
    // mostrar la pagina de creacion de nuevo, con los errores
    res.render('quizes/new', { quiz: quiz, errors: errores } );
  } else {
    quiz
    // guarda en DB los campos pregunta y respuesta de quiz
    .save({fields: ["pregunta", "respuesta"]})
    // redireccion HTTP (URL relativa) a pantalla lista de preguntas
    .then( function(){ res.redirect('/quizes')});
  }
};

// GET /author
exports.author = function(req, res) {
  res.render('author', { errors: [] });
};
