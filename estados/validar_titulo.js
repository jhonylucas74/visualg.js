var str = require('string');
var colors = require('colors/safe');
str.extendPrototype();

// Normaliza o algoritmo até achar o título
// Caso não encontre retorna um erro.
module.exports = function (linha, callback){
  if(linha.contains('algoritmo') && !linha.contains('fimalgoritmo')) {
    console.log(colors.green('Palavra reservada algoritmo encontrada.'));
    // validando título
    if(!linha.between('"', '"').isEmpty()){
      console.log(colors.green('Título válido'));
      console.log(colors.cyan('mudando para procurar var.'));

      callback(null, 'validarVar');
      return true;
    } else {
      var erro = 'Palavra reservada algoritmo foi'+
      ' encontrada \nmas título é inválido.';
      callback(erro, null);
      return false;
    }
  }

  if(!linha.isEmpty()){
    var erro ='Erro 301 : Era esperado encontrar a palavra reservada algoritmo.';
    callback(erro, null);
    return false;
  }
};
