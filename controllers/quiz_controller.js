// importar el modelo para poder acceder a la BD
var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye .quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
    // el parámetro where indica buscar el quiz con id dado
    // pero además se solicita cargar los comentarios asociados
    where: { id: Number(quizId) },
    include: [{ model: models.Comment }]
  }).then(function(quiz) {
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
  // obtener cadena a buscar de la url
  var search = req.query.search;
  var searchPatern = "%%";
  if (search != undefined) {
    searchPatern = "%" + search.split(" ").join("%") + "%"; //.replaceAll(" ","%") + "%"
  } else {
    search = "";
  }
  //console.log("BUSCO: " + search + ", con " + searchPatern);

  models.Quiz.findAll( { where: ["pregunta like ?", searchPatern] } ).then(function(quizes) {
    // en search voy a enviarle al template la cadena de busqueda previamente insertada
    res.render('quizes/index.ejs', { quizes: quizes, search: search, errors: [] });
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

// GET /quizes/new form
exports.new = function(req, res) {
  // crea un objeto quiz
  var quiz = models.Quiz.build(
      { pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema" }
  );
  res.render('quizes/new', { temas: models.Quiz.rawAttributes.tema.values, quiz: quiz, errors: [] });
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
    // guarda en DB los campos pregunta, respuesta y tema de quiz
    .save({fields: ["pregunta", "respuesta", "tema"]})
    // redireccion HTTP (URL relativa) a pantalla lista de preguntas
    .then( function(){ res.redirect('/quizes'); });
  }
};

// GET /quizes/:id/edit form
exports.edit = function(req, res) {
  // autoload de instancia de quiz
  var quiz = req.quiz;

  res.render('quizes/edit', { temas: models.Quiz.rawAttributes.tema.values, quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  var errors = req.quiz.validate();
  if (errors) {
    var i = 0; var errores = new Array();
    for (var prop in errors) {
      errores[i++] = {message: errors[prop]};
      //console.log(errors[prop]);
    }
    // mostrar la pagina de creacion de nuevo, con los errores
    res.render('quizes/edit', { quiz: req.quiz, errors: errores } );
  } else {
    req.quiz
    // guarda en DB los campos pregunta y respuesta de quiz
    .save({fields: ["pregunta", "respuesta", "tema"]})
    // redireccion HTTP (URL relativa) a pantalla lista de preguntas
    .then( function(){ res.redirect('/quizes'); });
  }
}

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then(
    function() {
      res.redirect('/quizes');
    }
  ).catch( function(error) { next(error) });
}

// GET /author
exports.author = function(req, res) {
  res.render('author', { errors: [] });
};
