const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    backgroundColor: "#049cd8",
    parent: 'juego',
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0.1},
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

new Phaser.Game(config);

let submarino;
let cursors;
let oxigeno = 100;
let oxigenoText;
let buzosRescatados = 0;
let vidas = 3;
let puntos = 0;
let puntosText;
let vidasText;
let oxigenoTimer;
let enemigos;
let buzos;
let buzosText;
let misiles;
let isGameOver = false;

function preload() {
    // Carga de imágenes
    this.load.image("oceano", "./assets/scenery/oceano.png");
    this.load.image("espuma", "./assets/scenery/espuma1.png");
    this.load.image("peces1", "./assets/scenery/peces1.png");
    this.load.image("algas", "./assets/scenery/algas.png");
    this.load.image("algas1", "./assets/scenery/algas1.png");
    this.load.image("burbujas", "./assets/scenery/burbuja.png");
    this.load.image("piso", "./assets/scenery/piso.png");
    this.load.image("submarino", "./assets/scenery/submarino.png");
    this.load.image("submarino_e", "./assets/scenery/submarino_e.png");
    this.load.image("tiburon", "./assets/scenery/tiburon.png");
    this.load.image("buso", "./assets/scenery/buso.png");
    this.load.image("misil", "./assets/scenery/misil.png");

    // Carga de spritesheet para explosión
    this.load.spritesheet('explosion', './assets/scenery/explosion.png', {
        frameWidth: 80,
        frameHeight: 80
    });

    // Carga de sonidos
    this.load.audio('bubble', './assets/sound/bubble.mp3');
    this.load.audio('misil', './assets/sound/misil.mp3');
    this.load.audio('water', './assets/sound/water.mp3');
    this.load.audio('explosion-enemiga', './assets/sound/explosion-enemiga.mp3');
}

function create() {
  // Fondo
  sonidoSuperficie = this.sound.add('water')
  this.sound.play('water', { volume: 0.8 });
  this.oceano = this.add.tileSprite(0, 80, 800, 600, "oceano").setOrigin(0, 0).setScale(0.8);
  this.espuma = this.add.tileSprite(0, 78, 9000, 30, "espuma").setOrigin(0, 0).setScale(0.3);
  this.burbuja = this.physics.add.image(50, 320, "burbujas").setOrigin(1, 0).setScale(0.7).setVelocityY(-10).setGravityY(-5);

  this.add.image(500, 250, "peces1").setOrigin(0, 0).setScale(0.2);

  // Submarino del jugador
  this.submarino = this.physics.add.sprite(300, 200, "submarino").setOrigin(0.5, 0.5).setCollideWorldBounds(true).setGravityY(null);

  // Piso
  this.piso = this.physics.add.staticImage(320, 400, "piso").setOrigin(0.5).setScale(0.8).refreshBody();
  this.physics.add.collider(this.submarino, this.piso)
  this.add.image(150,320, "algas").setOrigin(1,0).setScale(0.2);
  this.add.image(550,330, "algas1").setOrigin(1,0).setScale(0.2);
  
  //Techo
  this.limite = this.physics.add.staticImage(400, 70, null)
    .setDisplaySize(800, 10).setVisible(false).refreshBody();
  this.physics.add.collider(this.submarino, this.limite);

  // Controles
  this.keys = this.input.keyboard.createCursorKeys();
  this.input.keyboard.on('keydown-SPACE', dispararMisil, this);

  // Grupos
  enemigos = this.physics.add.group();
  buzos = this.physics.add.group();
  misiles = this.physics.add.group();
  submarinosEnemigos = this.physics.add.group();

 /*Animación de explosión
  this.anims.create({
      key: "muerte",
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 3 }),
      frameRate: 20,
      hideOnComplete: true
    });
*/

  // Textos
  oxigenoText = this.add.text(10, 10, 'Oxígeno: 100', { fontSize: '15px', fill: '#fff' });
  vidasText = this.add.text(10, 35, 'Vidas: 3', { fontSize: '15px', fill: '#fff' });
  puntosText = this.add.text(150, 35, 'Puntos: 0', { fontSize: '15px', fill: '#fff' });
  buzosText = this.add.text(150, 10, 'Buzos: 0', { fontSize: '15px', fill: '#fff' });

  // Sonidos
  sonidoExplosion = this.sound.add('explosion-enemiga');
  sonidoBurbuja = this.sound.add('bubble');
  sonidoMisil = this.sound.add('misil');
  sonidoSuperficie = this.sound.add('water');

  // Temporizador de oxígeno
  oxigenoTimer = this.time.addEvent({
       delay: 1000,
      callback: reducirOxigeno,
      callbackScope: this,
      loop: true
    });

  // Colisiones
  this.physics.add.overlap(this.submarino, enemigos, colisionEnemigo, null, this);
  this.physics.add.overlap(this.submarino, submarinosEnemigos, colisionEnemigo, null, this);
  this.physics.add.overlap(this.submarino, buzos, rescatarBuzo, null, this);
  this.physics.add.overlap(misiles, enemigos, destruirEnemigo, null, this);
  this.physics.add.overlap(misiles, submarinosEnemigos, destruirEnemigo, null, this);
  
  // Generar enemigos y buzos
  this.time.addEvent({
      delay: 1500,
      callback: generarEnemigo,
      callbackScope: this,
      loop: true
    });

  this.time.addEvent({
      delay: 2500,
      callback: generarBuzo,
      callbackScope: this,
      loop: true
    });
}

function reducirOxigeno() {
  if (!isGameOver) {
      oxigeno -= 3;
      oxigenoText.setText('Oxígeno: ' + oxigeno);
      if (oxigeno <= 0) {
          perderVida(this);
        }
    }
}

function recargarOxigeno(scene) {
    console.log("Buzos rescatados antes de recargar:", buzosRescatados);

        buzosRescatados = Math.max(0, buzosRescatados - 1);
        buzosText.setText('Buzos: ' + buzosRescatados);
        console.log("Se usó un buzo para recargar oxígeno. Buzos restantes:", buzosRescatados);

    oxigeno = 100;
    oxigenoText.setText('Oxígeno: ' + oxigeno);
}

function dispararMisil() {
  let misil = misiles.create(this.submarino.x, this.submarino.y, 'misil').setScale(0.5);
  misil.body.onWorldBounds = true;

  // Determina dirección del disparo según flipX
  if (this.submarino.flipX) {
    misil.setVelocityX(-300)
    .setFlipX(true);
  } else {
    misil.setVelocityX(300);
  }

  this.sound.play('misil', { volume: 0.5 });
}

function generarEnemigo() {
    // Decide aleatoriamente si se genera un tiburón o un submarino enemigo
    let tipoEnemigo = Phaser.Math.Between(0, 1); // 0 para tiburón, 1 para submarino
    let x = Phaser.Math.Between(0, 1) === 0 ? 0 : 600; 
    let y = Phaser.Math.Between(80, 350);
    let enemigo;

    if (tipoEnemigo === 0) {
        // Generar tiburón
        enemigo = enemigos.create(x, y, 'tiburon');
        if (x === 0) {
            enemigo.setVelocityX(Phaser.Math.Between(50, 100)); 
            enemigo.setFlipX(true); 
        } else {
            enemigo.setVelocityX(Phaser.Math.Between(-50, -100));
            enemigo.setFlipX(false); 
        }
    } else {
        // Generar submarino enemigo
        enemigo = submarinosEnemigos.create(x, y, 'submarino_e').setTint(0x98FF98);
        if (x === 0) {
            enemigo.setVelocityX(Phaser.Math.Between(50, 100)); 
            enemigo.setFlipX(true); 
        } else {
            enemigo.setVelocityX(Phaser.Math.Between(-50, -100));
            enemigo.setFlipX(false); 
        }
    }
  }

function generarBuzo() {
    // Decide aleatoriamente si el buzo aparece en el lado izquierdo o derecho
    let x = Phaser.Math.Between(0, 1) === 0 ? 0 : 600;
    let y = Phaser.Math.Between(80, 350);
    let buzo = buzos.create(x, y, 'buso').setScale(0.2);

    // Configura la dirección y la velocidad
    if (x === 0) {
        buzo.setVelocityX(Phaser.Math.Between(50, 100));
        buzo.setFlipX(false);
    } else { 
        buzo.setVelocityX(Phaser.Math.Between(-50, -100));
        buzo.setFlipX(true);
    }
}

function gameOver(scene) {
    // Mostrar mensaje
    scene.add.text(300, 200, 'GAME OVER', {
        fontSize: '48px',
        color: '#ff0000',
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Detener físicas y movimiento
    scene.physics.pause();
    scene.submarino.setTint(0xff0000);
    scene.submarino.body.enable = false;


    // Detener enemigos y buzos
    enemigos.children.iterate(enemigo => {
        enemigo.body.enable = false;
    });
    buzos.children.iterate(buzo => {
        buzo.body.enable = false;
    });

    // Mostrar texto para reiniciar
    const restartText = scene.add.text(300,250, 'Presiona R para reiniciar', {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Habilitar tecla R para reiniciar
    scene.input.keyboard.once('keydown-R', () => {
        scene.scene.restart();
    });

    isGameOver = true;

}

function perderVida(scene) {
    vidas -= 1;
    vidasText.setText('Vidas: ' + vidas);
    oxigeno = 100;
    oxigenoText.setText('Oxígeno: ' + oxigeno);
    buzosRescatados = 0;
    buzosText.setText('Buzos: ' + buzosRescatados);
    //scene.sound.play('water', { volume: 0.5 });

    scene.time.delayedCall(100, function() {
        scene.submarino.setPosition(300, 85); 
    });

    if (vidas <= 0) {
        gameOver(scene);
    }
  };

function colisionEnemigo(submarino, enemigo) {;
    sonidoExplosion.play();
    perderVida(this);
    enemigo.destroy();
}

function rescatarBuzo(submarino, buzo) {
    if (buzosRescatados < 6) {
        buzosRescatados += 1;
        puntos += 10;
        puntosText.setText('Puntos: ' + puntos);
        buzosText.setText('Buzos: ' + buzosRescatados);
        sonidoBurbuja.play();
        buzo.destroy();
    }
}

function destruirEnemigo(misil, enemigo) {
    sonidoExplosion.play();
    misil.destroy();
    enemigo.destroy();
    if (enemigo.texture.key === 'submarino_e') {
        puntos += 20;
    } else if (enemigo.texture.key === 'tiburon') {
        puntos += 10;
    } else {
        // Opcional: otros enemigos, puntos por defecto
        puntos += 10;
    }
    
    puntosText.setText('Puntos: ' + puntos);
}

function update() {
  // Movimiento del submarino
  if (this.keys.left.isDown) {
      this.submarino.x -= 2;
      this.submarino.flipX = true;
  } else if (this.keys.right.isDown) {
      this.submarino.x += 2;
       this.submarino.flipX = false;
  }if (this.keys.up.isDown) {
       this.submarino.y -= 2;
  } else if (this.keys.down.isDown) {
      this.submarino.y += 2;
  }

  if (this.keys.left.isDown && this.keys.up.isDown) {
      this.submarino.setAngle(45);
  } else if (this.keys.left.isDown && this.keys.down.isDown) {
      this.submarino.setAngle(-45);
  } else if (this.keys.right.isDown && this.keys.up.isDown) {
      this.submarino.setAngle(-45);
  } else if (this.keys.right.isDown && this.keys.down.isDown) {
      this.submarino.setAngle(45);
  } else {
        // Si no hay teclas presionadas, restablecer el ángulo
        this.submarino.setAngle(0);
  }

  // Verificar si el submarino está en la superficie
  if (this.submarino.y <= 80) {
        recargarOxigeno(this);
  }

  // Movimiento visual continuo del mar y la espuma
  this.oceano.tilePositionY -= 0.2;
  this.espuma.tilePositionY -= 0.5;

  if (this.burbuja && this.burbuja.y < 75) {
    this.burbuja.destroy();
    console.log("burbuja eliminada en Y < 75");
    this.burbuja = null;

    this.time.delayedCall(3000, () => {
        this.burbuja = this.physics.add.image(50, 320, "burbujas").setOrigin(1, 0).setScale(0.7).setVelocityY(-10).setGravityY(-5);
    });
}

  if (this.submarino.y < 75) {
        this.submarino.y = 75;
        this.submarino.body.velocity.y = 0; // Detiene su movimiento hacia arriba
    }
}