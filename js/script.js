// Variáveis de som
const somHit = new Audio();
const somPulo = new Audio();
const somQueda = new Audio();
const somPonto = new Audio();
somHit.src = '../sons/hit.wav';
somPulo.src = '../sons/pulo.wav';
somQueda.src = '../sons/queda.wav';
somPonto.src = '../sons/ponto.wav';

// Variáveis de imagem e canvas
const sprites = new Image();
sprites.src = "../img/sprites.png";
const canvas = document.getElementById("canvas");
const contexto = canvas.getContext("2d");

// Variáveis "globais"
let deslocamento1;
let deslocamento2;
let movimentoCanoTopo1;
let movimentoCanoChao1;
let movimentoCanoTopo2;
let movimentoCanoChao2;
let jaPassouCano1 = false;
let jaPassouCano2 = false;
let podeDesenhar2 = false;
let podeParalisar = false;

// Função construtora para criar os objetos que serão plotados na tela
function PlotaImagem(spriteX, spriteY, larguraImagem, alturaImagem, telaX, telaY) {
  this.imagem = sprites;
  this.spriteX = spriteX;
  this.spriteY = spriteY;
  this.larguraImagemSprite = larguraImagem;
  this.alturaImagemSprite = alturaImagem;
  this.telaX = telaX;
  this.telaY = telaY;
  this.larguraImagemTela = larguraImagem;
  this.alturaImagemTela = alturaImagem;
  this.desenhar = function() {
    contexto.drawImage(sprites, this.spriteX, this.spriteY, this.larguraImagemSprite, this.alturaImagemSprite, this.telaX, this.telaY, this.larguraImagemTela, this.alturaImagemTela);
  }
}

// Objetos do game
const telaFundo = new PlotaImagem(390, 0, 275, 204, 0, canvas.height - 204);
const telaFundoDeslocada = new PlotaImagem(390, 0, 275, 204, 275, canvas.height - 204);
const chao = new PlotaImagem(0, 610, 224, 112, 0, canvas.height - 112);
const chaoDeslocado = new PlotaImagem(0, 610, 224, 112, 224, canvas.height - 112);
const mensagemGetReady = new PlotaImagem(134, 0, 174, 152, (canvas.width / 2) - (174 / 2), 50);
const canoTopo1 = new PlotaImagem(52, 169, 52, 400, 320, 0);
const canoChao1 = new PlotaImagem(0, 169, 52, 400, 320, 0);
const canoTopo2 = new PlotaImagem(52, 169, 52, 400, 320, 0);
const canoChao2 = new PlotaImagem(0, 169, 52, 400, 320, 0);
const flappyBird = new PlotaImagem(0, 0, 33, 24, 10, 50);
// Definições adicionais do flappyBird:
flappyBird.gravidade = 0.25;
flappyBird.velocidade = 0;
flappyBird.pulo = 4.5;
// função de queda com verificações de colisão
flappyBird.queda = function() {
  // Variáveis para colisões
  const flappyYInicio = flappyBird.telaY;
  const flappyYFim = flappyBird.telaY + flappyBird.alturaImagemTela;
  const canoYInicio1 = deslocamento1 - 90;
  const canoYInicio2 = deslocamento2 - 90;
  // Verificação de colisão
  const colidiuComChaoOuParede = (flappyYInicio >= 344 || flappyYInicio <= 0);
  const colidiuComPrimeiroCano = ((movimentoCanoTopo1 >= -42 && movimentoCanoTopo1 <= 30) && (flappyYFim >= deslocamento1 || flappyYInicio <= canoYInicio1));
  const colidiuComSegundoCano = ((movimentoCanoTopo2 >= -42 && movimentoCanoTopo2 <= 30) && (flappyYFim >= deslocamento2 || flappyYInicio <= canoYInicio2));
  //-- 
  if(colidiuComChaoOuParede || colidiuComPrimeiroCano || colidiuComSegundoCano) {
    somHit.play();
    podeParalisar = true;
    setTimeout(() => {
      flappyBird.telaY = 50;
      flappyBird.velocidade = 0;
      chao.telaX = 0;
      chaoDeslocado.telaX = 224;
      canoTopo1.telaX = 320;
      canoChao1.telaX = 320;
      canoTopo2.telaX = 320;
      canoChao2.telaX = 320;
      jaPassouCano1 = false;
      jaPassouCano2 = false;
      podeDesenhar2 = false;
      podeParalisar = false;
      movimentoCanoTopo1 = 320;
      movimentoCanoChao1 = 320;
      movimentoCanoTopo2 = 320;
      movimentoCanoChao2 = 320;
      movimentoChao = 0;
      movimentoChaoDeslocado = 0;
      telaAtiva = inicio;
      return;
    }, 500);
  } else {
    if (this.velocidade >= 0) {
      this.spriteY = 0; // Posição com asa para cima
    } else {
      setTimeout(() => {
        this.spriteY = 26; // Posição com asa no meio
      }, 150)
    }
    this.velocidade = this.velocidade + this.gravidade;
    this.telaY = this.telaY + this.velocidade;
  }
};
// função de pulo
flappyBird.pular = function() {
  if(!somPulo.paused) {
    somPulo.currentTime = 0;
  }
  somPulo.play();
  this.spriteY = 52; // Posição com asa para baixo
  this.velocidade = - this.pulo;
};

// Cálculo da posição dos canos
function calculoCanos1() {
  let Range = (Math.floor(Math.random() * (360 - 180 + 1)) + 180) * (-1); // Range: de -360 até -180
  canoTopo1.telaY = Range;
  deslocamento1 = canoTopo1.alturaImagemTela + 90 + Range;
  canoChao1.telaY = deslocamento1;
  jaPassouCano1 = true;
}
function calculoCanos2() {
  let Range = (Math.floor(Math.random() * (360 - 180 + 1)) + 180) * (-1);
  canoTopo2.telaY = Range;
  deslocamento2 = canoTopo2.alturaImagemTela + 90 + Range;
  canoChao2.telaY = deslocamento2;
  jaPassouCano2 = true;
  podeDesenhar2 = true;
}

function ativaCondicoesCanos() {
  // Condições cano 1
  if(jaPassouCano1 === false) {
    calculoCanos1();
  }
  if(canoTopo1.telaX < -52) {
    jaPassouCano1 = false
    canoTopo1.telaX = 320;
    canoChao1.telaX = 320;
  }
  canoTopo1.desenhar();
  canoChao1.desenhar();

  // Condições cano 2
  if(canoTopo1.telaX <= 134 && jaPassouCano2 === false) {
    canoTopo2.telaX = canoTopo1.telaX + 185;
    canoChao2.telaX = canoTopo1.telaX + 185;
    calculoCanos2();
  }
  if(podeDesenhar2 === true) {
    canoTopo2.desenhar();
    canoChao2.desenhar();
  }
  if(canoTopo2.telaX < -52) {
    podeDesenhar2 = false;
    jaPassouCano2 = false
  }
}

// Função construtora para criar os eventos de cada tela do jogo
function PlotaTela(nomeTela) {
  this.desenhar = function() {
    telaFundo.desenhar();
    telaFundoDeslocada.desenhar();
    chao.desenhar();
    chaoDeslocado.desenhar();
    flappyBird.desenhar();
    if(nomeTela === 'inicio') {
      mensagemGetReady.desenhar();
    } else {
      ativaCondicoesCanos();
    }
  };
  this.click = function() {
    if(nomeTela === 'inicio') {
      telaAtiva = jogo;
    } else {
      flappyBird.pular()
    }
  };
  this.queda = function() {
    if(nomeTela === 'jogo') {
      flappyBird.queda();
    };
  };
  this.cenario = function() {
    if(nomeTela === 'jogo') {
      if(podeParalisar === false) {
      // Descolamento do chao
      const decremento = 2.25;
      let movimentoChao = chao.telaX - decremento;
      let movimentoChaoDeslocado = chaoDeslocado.telaX - decremento;
      if(chao.larguraImagemTela + movimentoChao <= chao.larguraImagemTela / 2 ) {
        movimentoChao = 0;
        movimentoChaoDeslocado = 224;
      }
      chao.telaX = movimentoChao;
      chaoDeslocado.telaX = movimentoChaoDeslocado;

      // Descolamento dos canos
        movimentoCanoTopo1 = canoTopo1.telaX - decremento;
        movimentoCanoChao1 = canoChao1.telaX - decremento;
        canoTopo1.telaX = movimentoCanoTopo1;
        canoChao1.telaX = movimentoCanoChao1;

        if(podeDesenhar2 === true) {
          movimentoCanoTopo2 = canoTopo2.telaX - decremento;
          movimentoCanoChao2 = canoChao2.telaX - decremento;
          canoTopo2.telaX = movimentoCanoTopo2;
          canoChao2.telaX = movimentoCanoChao2;
        }
      }
    };
  };
};

// TELAS DO GAME
const inicio = new PlotaTela('inicio');
const jogo = new PlotaTela('jogo');
let telaAtiva = inicio;

// EVENTO DE LOOP
function loop() {
  // Colore o plano de fundo
  contexto.fillStyle = "#70c5ce";
  contexto.fillRect(0, 0, canvas.width, canvas.height);
  // Chama as funções a serem executadas de acordo com a tela ativa
  telaAtiva.queda();
  telaAtiva.cenario();
  telaAtiva.desenhar();
  // É quantas vezes está sendo plotado na tela
  requestAnimationFrame(loop);
}
loop();

window.addEventListener('click', function() {
    telaAtiva.click();
});
