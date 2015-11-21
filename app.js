  var str = require('string');
  var colors = require('colors/safe');
  str.extendPrototype();

  /* Carregar funções de estado
  ============================================================================*/
  var estados  = {};
  // Validar a palavra reservada algoritmo
  estados.validarTitulo = require('./estados/validar_titulo.js');
  // Validar a palavra reservada var
  estados.validarVar = require('./estados/validar_var.js');
  // Declarando as variáveis
  estados.definindoVars = require('./estados/definindo_vars.js');
  // Executar comandos
  estados.executarComandos = require('./estados/executar_comandos.js');
  // Fim algoritmo
  estados.fimAlgoritmo = require('./estados/fim_algoritmo.js');

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
    'idade <- 20 - 10 +   20',
    'nome <- idade + " idade"',
    'fimalgoritmo'
  ];

  function printErro(msg){
    console.log(colors.red(msg));
  }

  /*
    EXECUTANDO ALGORITMO
    =========================================================================
  */

  // Variável que diz que ação deve acontecer
  // a cada contexto possível da análise.
  var acaoDeEstado = 'validarTitulo';

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

  /*
    Analisando o algoritmo. */
    var parar = false;
    for (var i = 0; i < algoritmo.length; i++) {
      if(parar)
        break;

      console.log(algoritmo[i]);

      // acao de estado é uma funç]ap que é modificada a todo tempo
      // pelo sistema. Seu valor é referente ao estado atual do processo.
       estados[acaoDeEstado](algoritmo[i], function(erro, novaAcaoDeEstado){
         if(erro){
           printErro(erro);
           console.log(colors.red('Erro na linha: '+ (i + 1) ));
           parar = true;
         } else {
           if(novaAcaoDeEstado){
             acaoDeEstado = novaAcaoDeEstado;
           }
         }
       });
    }


  console.log('\n\n');
