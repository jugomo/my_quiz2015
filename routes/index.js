var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// GET author page
router.get('/author', quizController.author);

// GET questions page
router.get('/quizes',               quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);

// GET answers page
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

module.exports = router;
