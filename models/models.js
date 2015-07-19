// este modulo construye la DB y el modelo importando 'quiz.js'

var path = require('path');

// cargar modelo ORM
var Sequelize = require('sequelize');

// usar BBDD SQLite:
var sequelize = new Sequelize(null, null, null,
                        { dialect: "sqlite", storage: "quiz.sqlite" });

// importar la definicion de la tabla de Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// exportar la definicion de la tabla Quiz
exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa tabla de preguntas en DB segundefine el modelo
// esta funcion crea automaticamente el fichero 'quiz.sqlite' si no existe con la
// BD y los datos iniciales. si existe sincroniza con nuevas definiciones si son compatibles
sequelize.sync().success(function(){
  // success(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().success(function(count){
    // la tabla se inicializa solo si esta vacia
    if (count === 0) {
      // crear la primera pregunta y guardarla en la tabla
      Quiz.create({
        pregunta: 'Capital de Italia',
        respuesta: 'Roma'
      })
      .success(function(){console.log('Base de datos inicializada')});
    };
  });
});
