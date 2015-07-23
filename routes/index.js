var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// GET author page
router.get('/author',                      quizController.author);

// Autoload de comandos con :quizId
// se instala para que se ejecute antes que lo necesiten las rutas
// show y answer y solo en el caso de que path contenga :quizId en
// algun lugar (query, body, param) de la cabecera HTTP
router.param('quizId',                     quizController.load);

// GET questions page
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);

// GET answers page
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

// GET creation form
router.get('/quizes/new',                  quizController.new);

// POST creation of quiz
router.post('/quizes/create',              quizController.create);

module.exports = router;
