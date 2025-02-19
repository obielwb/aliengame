// Define o tamanho da tela
const width = 700;
const height = 850;

let alien;
let keyboard;
let boost;
let platform;
let coin;
let scoreboard;
let cloud;
let score = 0;

let coinsCaughtPositions = []; // armazena as posições das moedas coletadas

class AlienGame extends Phaser.Scene {
  preload() {
    this.load.image("background", "assets/background.png");

    this.load.image("player", "assets/alien.png");
    this.load.image("boost", "assets/boost.png");
    this.load.image("platform", "assets/bricks.png");
    this.load.image("coin", "assets/coin.png");
    this.load.image("cloud", "assets/cloud.png");
  }

  create() {
    // adiciona a imagem de fundo
    this.add.image(width / 2, height / 2, "background");

    boost = this.add.sprite(0, 0, "boost");
    boost.setVisible(false);

    alien = this.physics.add.sprite(width / 2, 0, "player");
    alien.setCollideWorldBounds(true); // impede que o alien saia dos limites da tela

    keyboard = this.input.keyboard.createCursorKeys();

    platform = this.physics.add.staticImage(width / 2, height / 2, "platform");
    this.physics.add.collider(alien, platform);

    cloud = this.physics.add
      .staticImage(width / 3, 180, "cloud")
      .setScale(0.25);

    // Ajusta manualmente o tamanho da caixa de colisão para corresponder à imagem dimensionada
    cloud.body.setSize(cloud.width * 0.25, cloud.height * 0.25);

    // Centraliza a caixa de colisão da nuvem com sua imagem
    cloud.body.setOffset(
      (cloud.width - cloud.body.width) / 2,
      (cloud.height - cloud.body.height) / 2
    );

    this.physics.add.collider(alien, cloud);

    coin = this.physics.add.sprite(width / 2, 0, "coin");
    coin.setCollideWorldBounds(true);
    coin.setBounce(0.7); // ajusta a elasticidade da moeda
    this.physics.add.collider(coin, platform);
    this.physics.add.collider(coin, cloud);

    scoreboard = this.add.text(50, 50, "Moedas:" + score, {
      fontSize: "45px",
      fill: "#495613",
    });

    this.physics.add.overlap(alien, coin, () => {
      coin.setVisible(false);

      score += 1;
      scoreboard.setText("Moedas:" + score);

      // adiciona a posição da moeda coletada ao array e exibe o arary no console desestruturado para mostrar seus valores
      coinsCaughtPositions.push({ x: coin.x, y: coin.y });
      console.log("Posições das moedas coletadas:", ...coinsCaughtPositions);

      const coinPositionX = Phaser.Math.RND.between(50, 650); // gera uma posição X aleatória para a moeda de 50 a 650
      coin.setPosition(coinPositionX, 100);
      coin.setVisible(true);
    });
  }

  update() {
    if (keyboard.left.isDown) {
      alien.setVelocityX(-150);
    } else if (keyboard.right.isDown) {
      alien.setVelocityX(150);
    } else {
      alien.setVelocityX(0);
    }

    if (keyboard.up.isDown) {
      alien.setVelocityY(-150);
      this.activateBoost();
    } else if (keyboard.down.isDown) {
      alien.setVelocityY(150);
    } else {
      this.deactivateBoost(); // desativa o boost quando a tecla de seta para cima não está pressionada
    }
  }

  activateBoost() {
    boost.setVisible(true);
    boost.setPosition(alien.x, alien.y + alien.height / 2); // posiciona o boost abaixo do alien
  }

  deactivateBoost() {
    boost.setVisible(false);
  }
}

// Define as configurações do jogo
const config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
  scene: AlienGame,
};

// Cria o phaser game com as configurações definidas
const game = new Phaser.Game(config);
