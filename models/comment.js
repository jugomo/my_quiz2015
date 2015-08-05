// definición del modelo para los comentarios sobre las preguntas

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Comment',
    {
      texto: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: "-> Falta comentario" } }
      },
      publicado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      classMethods: {
        countUnpublished: function () {
          var a = this.aggregate('QuizId', 'count', {'where': { 'publicado': false }})
          .then('success',function(count) {
            return count;
          })
          return a;
        },
        countCommentedQuizes: function () {
          var b = this.aggregate('QuizId', 'count', { 'distinct': true } )
          .then('success',function(count) {
            return count;
          })
          return (b);
        }
      }
    }
  );
};
