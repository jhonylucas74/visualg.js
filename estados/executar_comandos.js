var str = require('string');
var colors = require('colors/safe');
str.extendPrototype();

/* Carregar funções de comandos
============================================================================*/
var comandos = {};
// Constantes e Comando de Atribuição
comandos.atribuicao = require('./comandos/atribuicao.js');

// Procurar e validar a palavra reservada var
module.exports = function (linha, callback){
  // checando se não é a palavra reservada fimalgoritmo
  if(linha.trim() == 'fimalgoritmo') {
    console.log(colors.green('Palavra reservada fimalgoritmo encontrada.'));

    console.log(colors.cyan('finalizando algoritmo.'));
    callback(null, 'fimAlgoritmo');
    return true;
  }

  // Realizar vários testes afim de indentificar que tipo de Comando
  // foi declarado nessa linha e assim repassar para uma função capaz
  // de realizar o processo.

  // Constantes e Comando de Atribuição
  if(linha.contains('<-')) {
    comandos.atribuicao(this, linha, function(erro){
      if(erro){
        callback(erro, null);
        return false;
      }

      // continue próxima linha
      callback(null, 'executarComandos');
      return true;
    });
  };


};
