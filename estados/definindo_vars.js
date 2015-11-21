var str = require('string');
var colors = require('colors/safe');
str.extendPrototype();

/* Salvando as declarações de variáveis do usuário.
  =========================================================================*/

module.exports = function(linha, callback) {

  if(!this.variaveis)
    this.variaveis = {};

  // checando se não é a palavra reservada inicio
  if(linha.trim() == 'inicio') {
    console.log(colors.green('Palavra reservada inicio encontrada.'));

    console.log(colors.cyan('Executando comandos.'));
    callback(null, 'executarComandos');
    return true;
  }

  if(!linha.contains(':')) {
    var erro = 'Erro 303 : Era esperado encontrar o caractere : ';
    callback(erro, null);
    return false;
  }

  // pegando a primeira parte
  var vnomes = str(linha).between('',':');
  var tipo = str(linha).between(':').trim().s;

  // verificando se o tipo é válido
  function testeTipo(value){
    value = str(value).trim().s;

    if( value != 'inteiro'   &&
        value != 'real'      &&
        value != 'caractere' &&
        value != 'logico'    ){
      return false;
    }

    return true;
  }

  // Primeiramente testando se é um array
  if(tipo.contains('vetor')){
    // verifique a palavra reservada de
    if(!tipo.contains('de')){
      var erro = 'Erro 304 : Era esperado a palavra reservada de';
      callback(erro, null);
      return false;
    } else {
      // checando o tipo
      var arrayTipo = str(tipo).between('de').trim().s;
      if( !testeTipo(arrayTipo) ) {
        return false;
      } else {
        // verificando se lista-de-intervalos está ok
        if(!str(tipo).contains('[')){
          var erro = 'Erro 305 : Era esperado encontrar o caractere [';
          callback(erro, null);
          return false;
        }

        if(!str(tipo).contains(']')){
          var erro = 'Erro 306 : Era esperado encontrar o caractere ]';
          callback(erro, null);
          return false;
        }

        var intervalos = str(tipo).between('[',']').s;
        var dimensoes = [];
        // analisar intervalo e criar dimensão
        function addDimensao(inervalo){
          if(!str(tipo).contains('..')){
            var erro = 'Erro 307 : Era esperado encontrar os caracteres ..';
            callback(erro, null);
            return false;
          }
          var inicio = str(inervalo).between('','..').trim().s;
          var fim = str(inervalo).between('..').trim().s;

          if( !str(inicio).isNumeric() || !str(fim).isNumeric() ){
            var erro = 'Erro 503 : O intervalo definido na criação do array não é um número.';
            callback(erro, null);
            return false;
          }

          dimensoes.push({
            inicio: inicio,
            fim: fim
          });

          return true;
        }

        if(str(intervalos).contains(',')){
          // quando tem várias dimensões
          intervalos = intervalos.split(',');

          for (var i = 0; i < intervalos.length; i++) {
            if(!addDimensao(intervalos[i]))
              return false;
          }

        } else {
          // quando tem apenas uma dimensão
          if(!addDimensao(intervalos))
            return false;
        }

        tipo = {
          valor: str(tipo).between('de').trim().s,
          dimensoes: dimensoes
        };

      }

    }

  } else {
    // Quando não é um array

    if(!testeTipo(tipo)){
      var erro = 'Erro 502 : Tipo da variável não é válido.';
      callback(erro, null);
    }

    tipo = { valor: tipo };
  }

  // Criando as variáveis
  // vale para todos

  if(vnomes.contains(',')){
    vnomes = vnomes.split(',');

    for (var i = 0; i < vnomes.length; i++) {
      vnomes[i] = str(vnomes[i]).trim().s;
      this.variaveis[vnomes[i]] = { valor: null, tipo: tipo };
      console.log(colors.magenta(vnomes[i] + JSON.stringify(this.variaveis[vnomes[i]]))) ;
    }
  } else {
    this.variaveis[vnomes] = { valor: null, tipo: tipo };
    console.log(colors.magenta( vnomes + JSON.stringify(this.variaveis[vnomes])));
  }

  callback(null, 'definindoVars');
  return true;
};
