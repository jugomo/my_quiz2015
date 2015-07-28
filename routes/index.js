var express = require('express');
var router = express.Router();

var quizController    = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page: obtener pagina de entrada */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// GET author page
router.get('/author',                      quizController.author);

// AUTOLOAD DE COMANDOS con :quizId
// se instala para que se ejecute antes que lo necesiten las rutas
// show y answer y solo en el caso de que path contenga :quizId en
// algun lugar (query, body, param) de la cabecera HTTP
router.param('quizId',                     quizController.load);

router.param('commentId',                  commentController.load);


// DEFINICION DE RUTAS DE SESION

// GET formulario login
router.get('/login',  sessionController.new);
// POST crear la sesion
router.post('/login', sessionController.create);

// GET destruir la sesion
router.get('/logout', sessionController.destroy);


// DEFINICION DE RUTAS DE QUIZZES

// GET questions page
router.get('/quizes',                      quizController.index);
// GET a page for a quiz
router.get('/quizes/:quizId(\\d+)',        quizController.show);

// GET answers page
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

// una ruta puede invocarse con varios middlewares en serie. si el primero no pasa
// el control con next(), el segundo nunca llega a ejecutarse

// GET creation form
router.get('/quizes/new',                  sessionController.loginRequired, quizController.new);
// POST creation of quiz
router.post('/quizes/create',              sessionController.loginRequired, quizController.create);

// GET edit quiz form
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);
// PUT the quiz to update
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update);

// DELETE the quiz
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy);


// DEFINICION DE RUTAS DE COMENTARIOS

// GET add comment form
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
// POST creation of comment
router.post('/quizes/:quizId(\\d+)/comments',    commentController.create);
// GET del formulario de moderacion
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
                                                 sessionController.loginRequired, commentController.publish);

module.exports = router;
