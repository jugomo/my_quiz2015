// este modulo construye la DB y el modelo importando 'quiz.js'

var path = require('path');

// URL para produccion (heroku):
// Postges DATABASE_URL = postgres://user:passwd@host:port/database

// URL para local:
// SQLite  DATABASE_URL = sqlite://:@:/

// extraigo los parametros de conexion a la BD de la url con reg-exp
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6] || null);
var user     = (url[2] || null);
var pwd      = (url[3] || null);
var protocol = (url[1] || null);
var dialect  = (url[1] || null);
var port     = (url[5] || null);
var host     = (url[4] || null);
var storage  = process.env.DATABASE_STORAGE;

// cargar modelo ORM
var Sequelize = require('sequelize');

// Cargar Modelo ORM
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postges
  }
);

// usar BBDD SQLite:
//var sequelize = new Sequelize(null, null, null,
  //                      { dialect: "sqlite", storage: "quiz.sqlite" });

// importar la definicion de la tabla de Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// exportar la definicion de la tabla Quiz
exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa tabla de preguntas en DB segundefine el modelo
// esta funcion crea automaticamente el fichero 'quiz.sqlite' si no existe con la
// BD y los datos iniciales. si existe sincroniza con nuevas definiciones si son compatibles
sequelize.sync().then(function(){
  // success(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count){
    // la tabla se inicializa solo si esta vacia
    if (count === 0) {
      // crear la primera pregunta y guardarla en la tabla
      Quiz.create({
        pregunta: 'Capital de Italia',
        respuesta: 'Roma'
      });
      Quiz.create({
        pregunta: 'Capiutal de Portugal',
        respuesta: 'Lisboa'
      })
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});
