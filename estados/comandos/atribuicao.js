var str = require('string');
var colors = require('colors/safe');
str.extendPrototype();

// Constantes e Comando de Atribuição
module.exports = function(contexto, linha, callback) {

  // separando a váriavel do valor da atribuição
  var variavel = str(linha).between('','<-').trim().s;
  var expressao = str(linha).between('<-').trim().s;

  var nomesDasVariaveis = Object.keys(contexto.variaveis);

  var encontrou = false;
  for (var i = 0; i < nomesDasVariaveis.length; i++) {
    if(nomesDasVariaveis[i] == variavel)
      encontrou = true;
  }

  // verificando se variavel existe
  if(!encontrou){
    var erro = "Erro 401: variável não foi declarada no inicio do programa.";
    callback(erro);
    return false;
  }

  // removendo operadores para poder validar apenas os valores
  var temp =
    expressao.replaceAll("+", ' + ');
  temp = temp.replaceAll("-", ' - ');
  temp = temp.replaceAll("/", ' / ');
  temp = temp.replaceAll("*", ' * ');
  temp = temp.replaceAll("(", ' ( ');
  temp = temp.replaceAll(")", ' ) ');

  temp = str(temp).collapseWhitespace().s;

  var valores = temp.split(' ');

  for (var i = 0; i < valores.length; i++) {
    var tipo = null;

    if(valores[i] != '+'
    && valores[i] != '-'
    && valores[i] != '/'
    && valores[i] != '*'
    && valores[i] != '('
    && valores[i] != ')') {

      // caso tenha aspas é caractere
      if(str(valores[i]).contains('"')){
        tipo = 'caractere';
      } else {
        // se for apenas númerico é inteiro ou decimal
        if(Number(valores[i])) {
          tipo = 'numero';
        } else {
          // Caso não passe nas duas condições acima é porque o valor é uma
          // referência para uma variável
          var encontrou = false;
          for (var j = 0; j < nomesDasVariaveis.length; j++) {
            if(nomesDasVariaveis[j] == valores[i]){
              encontrou = true;
            }
          }

          // verificando se variavel existe
          if(!encontrou){
            var erro = "Erro 401: variável não foi declarada no inicio do programa: " + valores[i];
            callback(erro);
            return false;
          }

          valores[i] = contexto.variaveis[valores[i]].valor;
        }
      }
    }

  }


  // Atribuindo
  expressao = valores.join(' ');
  console.log(expressao);
  contexto.variaveis[variavel].valor = eval(expressao);
  console.dir(contexto.variaveis);

  callback(null);
  return true;

};
