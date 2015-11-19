  var str = require('string');
  var colors = require('colors/safe');

  str.extendPrototype();

  var algoritmo = [
    'algoritmo "semnome"',
    '// Função :',
    '// Autor :',
    '// Data : ',
    '  ',
    'var',
    '  nome,  idade: inteiro',
    'lista: vetor [1..20, 3..2] de inteiro',
    'inicio',
    '// Seção de Comandos ',
    'fimalgoritmo'
  ];

  function printErro(msg){
    console.log(colors.red(msg));
  }

  /*
    TRATANDO HEADER
    =========================================================================
  */

  // Normaliza o algoritmo até achar o título
  // Caso não encontre retorna um erro.
  function validarTitulo(linha){
    if(linha.contains('algoritmo') && !linha.contains('fimalgoritmo')) {
      console.log(colors.green('Palavra reservada algoritmo encontrada.'));
      // validando título
      if(!linha.between('"', '"').isEmpty()){
        console.log(colors.green('Título válido'));
        console.log(colors.cyan('mudando para procurar var.'));
        acaoDeEstado = validarVar;
        return true;
      } else {
        printErro('Palavra reservada algoritmo foi'+
        ' encontrada \nmas título é inválido.');
        return false;
      }
    }

    if(!linha.isEmpty()){
      printErro('Erro 301 : Era esperado encontrar a palavra reservada algoritmo.');
      return false;
    }

  }

  /*
    TRATANDO VARIÁVEIS
    =========================================================================
  */

  // Procurar e validar a palavra reservada var
  function validarVar(linha){
    if(linha.trim() == 'var') {
      console.log(colors.green('Palavra reservada var encontrada.'));
      console.log(colors.cyan('mudando para definir variáveis.'));
      acaoDeEstado = definindoVar;
      return true;
    } else {
      printErro('Erro 302 : Era esperado encontrar a palavra reservada var.');
      return false;
    }
  }

  var variaveis = {};

  function definindoVar(linha) {
    // checando se não é a palavra reservada inicio
    if(linha.trim() == 'inicio') {
      console.log(colors.green('Palavra reservada inicio encontrada.'));
      return true;
    }

    if(!linha.contains(':')) {
      printErro('Erro 303 : Era esperado encontrar o caractere : ');
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
            console.log(value);
        printErro('Erro 502 : Tipo da variável não é válido.' + value);
        return false;
      }
      return true;
    }

    // Primeiramente testando se é um array
    if(tipo.contains('vetor')){
      // verifique a palavra reservada de
      if(!tipo.contains('de')){
        printErro('Erro 304 : Era esperado a palavra reservada de');
        return false;
      } else {
        // checando o tipo
        var arrayTipo = str(tipo).between('de').trim().s;
        if( !testeTipo(arrayTipo) ) {
          return false;
        } else {
          // verificando se lista-de-intervalos está ok
          if(!str(tipo).contains('[')){
            printErro('Erro 305 : Era esperado encontrar o caractere [');
            return false;
          }

          if(!str(tipo).contains(']')){
            printErro('Erro 306 : Era esperado encontrar o caractere ]');
            return false;
          }

          var intervalos = str(tipo).between('[',']').s;
          var dimensoes = [];
          // analisar intervalo e criar dimensão
          function addDimensao(inervalo){
            if(!str(tipo).contains('..')){
              printErro('Erro 307 : Era esperado encontrar os caracteres ..');
              return false;
            }
            var inicio = str(inervalo).between('','..').trim().s;
            var fim = str(inervalo).between('..').trim().s;

            if( !str(inicio).isNumeric() || !str(fim).isNumeric() ){
              printErro('Erro 503 : O intervalo definido na criação do array não é um número.');
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
            value: str(tipo).between('de').trim().s,
            dimensoes: dimensoes
          };

        }

      }

    } else {
      // Quando não é um array

      if(!testeTipo(tipo))
        return false;

      tipo = { value: tipo };
    }

    // Criando as variáveis
    // vale para todos

    if(vnomes.contains(',')){
      vnomes = vnomes.split(',');

      for (var i = 0; i < vnomes.length; i++) {
        vnomes[i] = str(vnomes[i]).trim().s;
        variaveis[vnomes[i]] = { valor: null, tipo: tipo };
        console.log(colors.magenta(vnomes[i] + JSON.stringify(variaveis[vnomes[i]]))) ;
      }
    } else {
      variaveis[vnomes] = { valor: null, tipo: tipo };
      console.log(colors.magenta( vnomes + JSON.stringify(variaveis[vnomes])));
    }

    return true;
  }

  /*
    EXECUTANDO ALGORITMO
    =========================================================================
  */

  // Variável que diz que ação deve acontecer
  // a cada contexto possível da análise.
  var acaoDeEstado = validarTitulo;

  console.log('\n\n');
  console.log(colors.cyan('procurando algoritmo.'));

  // Removendo comentários
  algoritmo = algoritmo.map(function(linha){
    if(linha.contains('//')){
      return  linha.replace('//' + str(linha).between('//'), "");
    } else {
      return linha;
    }
  });

  // Removendo linhas vazias
  algoritmo = algoritmo.filter(function(linha) {
    return !linha.isEmpty();
  });

  // analisando o algoritmo
  for (var i = 0; i < algoritmo.length; i++) {
    console.log(algoritmo[i]);

    if( !acaoDeEstado(algoritmo[i]) ) {
      console.log(colors.red('Erro na linha: '+ (i + 1) ));
      return;
    }
  }

  console.log('\n\n');
