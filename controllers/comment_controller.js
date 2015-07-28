var models = require('../models/models.js');

// Autoload: si la ruta lleva :commentId
exports.load = function(req, res, next, commentId) {
  models.Comment.find({
    where: {
      id: Number(commentId)
    }
  })
  .then(function(comment) {
    if (comment) {
      req.comment = comment;
      next();
    } else {
      next(new Error('No existe commentId=' + commentId))
    }
  })
  .catch(function(error) {
    next(error)
  });
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
  res.render('comments/new.ejs', { quizId: req.params.quizId, errors: [] });
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
  // la relacion belongsTo() añade un parametro :quizId adicional
  // en cada elemento de la tabla Comments que indica el Quiz asociado
  var comment = models.Comment.build({
        texto: req.body.comment.texto,
        QuizId: req.params.quizId
  });

  var errors = comment.validate();
  if (errors) {
    var i = 0; var errores = new Array();
    for (var prop in errors) {
      errores[i++] = { message: errors[prop] };
    }
    // mostrar la pagina de creacion de comentario, con los errores
    res.render('comments/new.ejs', {
      comment: comment,
      quizId: req.params.quizId,
      errors: err.errors
    });
  } else {
    comment
    // guarda en DB el campo texto de comentario
    .save()
    // redireccion HTTP (URL relativa) a pantalla lista de preguntas
    .then( function() {
        res.redirect('/quizes/' + req.params.quizId)
    })
    // capturar errore producidos al salvar
    .catch( function(error) { next(error) } );
  }
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
  req.comment.publicado = true;

  req.comment.save( {
    fields: ["publicado"]
  }).then( function() {
    res.redirect('/quizes/' + req.params.quizId);
  }).catch( function(error) {
    next(error)
  });
};
