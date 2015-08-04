// Controlador para la gestión de estadísticas

// importar el modelo para poder acceder a la BD
var models = require('../models/models.js');

// objeto que almacena datos estadisticos procesados
var statistics = {
      quizes: 0,
      comments: 0,
      commentsUnpublished: 0,
      commentedQuizes:0
    };

var errors = [];

// MW de procesamiento de datos estadisticos
exports.calculate = function (req, res, next) {
  models.Quiz.count()
  // preguntas
  .then(function (numQuizes) {
    statistics.quizes = numQuizes;
    return models.Comment.count();
  })
  // comentarios
  .then(function (numComments) {
    statistics.comments = numComments;
    return models.Comment.countUnpublished();
  })
  // comentarios no publicados
  .then(function (numUnpublished) {
    statistics.commentsUnpublished = numUnpublished;
    return models.Comment.countCommentedQuizes();
  })
  // preguntas con comentario
  .then(function (numCommented) {
    statistics.commentedQuizes = numCommented;
  })
  // capturar errores
  .catch(function (err) { errors.push(err); })
  .finally(function () {
    next();
  });

};

// GET /quizes/statistics
exports.show = function (req, res) {
  res.render('statistics/show', { statistics: statistics, errors: errors });
};
