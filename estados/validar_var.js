var str = require('string');
var colors = require('colors/safe');
str.extendPrototype();

// Procurar e validar a palavra reservada var
module.exports = function (linha, callback){
  if(linha.trim() == 'var') {
    console.log(colors.green('Palavra reservada var encontrada.'));
    console.log(colors.cyan('mudando para definir variáveis.'));

    callback(null, 'definindoVars');
    return true;
  } else {
    var erro = 'Erro 302 : Era esperado encontrar a palavra reservada var.';
    callback(erro, null);
    return false;
  }
};
