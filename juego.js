const config = {
   type: Phaser.AUTO,
    width: 600,
    height: 400,
    backgroundColor: "#049cd8",
    parent: 'juego',
    physics: {
        default:"arcade",
        arcade:{
            gravity:{y:2}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

new Phaser.Game(config);

function preload() {
  this.load.image("oceano", "./assets/scenery/oceano.png");
  this.load.image("espuma", "./assets/scenery/espuma1.png");
  this.load.image("peces1", "./assets/scenery/peces1.png");
  this.load.image("algas", "./assets/scenery/algas.png");
  this.load.image("algas1", "./assets/scenery/algas1.png");
  this.load.image("burbujas", "./assets/scenery/burbuja.png");

  this.load.image("submarino", "./assets/scenery/submarino.png");
  this.load.spritesheet('explosion', './assets/scenery/explosion.png',
        {frameWidth: 80, frameHeight: 80}
    )
  this.load.image("submarino_e", "./assets/scenery/submarino_e.png");
  this.load.image("tiburon", "./assets/scenery/tiburon.png");
  this.load.image("buso", "./assets/scenery/buso.png");

  this.load.image("piso", "./assets/scenery/piso.png");
  


};

function create() {

  this.anims.create({
    key: "muerte", 
    frames: this.anims.generateFrameNumbers(
      'explosion',
    {start: 0, end: 3}),
    frameRate: 12,
    hideOnComplete: true
    })

  this.oceano = this.add.tileSprite(0, 80, 800, 600, "oceano").setOrigin(0, 0).setScale(0.8);
  this.espuma = this.add.tileSprite(0, 78, 9000, 30, "espuma").setOrigin(0, 0).setScale(0.3);
  this.burbuja = this.physics.add.image(50, 320, "burbujas").setOrigin(1, 0).setScale(0.7).setVelocityY(-10).setGravityY(-5);
 
  this.add.image(500,250, "peces1").setOrigin(0,0).setScale(0.2);

  this.tiburon = this.physics.add.image(100, 100, "tiburon").setOrigin(1,0).setVelocityX(10).setGravityY(0);
  this.buso = this.physics.add.image(150, 100, "buso").setOrigin(1,0).setScale(0.2).setVelocityX(10).setGravityY(0);
  this.submarino_e = this.physics.add.image(200, 200, 'submarino_e').setOrigin(0, 0).setVelocityX(10).setGravityY(0);
  this.submarino = this.physics.add.image(300, 200, 'submarino').setOrigin(0.5, 0.5);

  this.submarino_e.setCollideWorldBounds(true);
  this.submarino.setCollideWorldBounds(true)
  this.buso.setCollideWorldBounds(true);
  this.tiburon.setCollideWorldBounds(true)

  this.piso = this.physics.add.staticImage(300, 400, "piso").setOrigin(0.5).setScale(0.8).refreshBody();
  this.physics.add.collider(this.submarino, this.piso)
  this.physics.add.collider(this.submarino_e, this.piso)
  this.physics.add.collider(this.buso, this.piso)
  this.physics.add.collider(this.tiburon, this.piso)
  
  this.physics.add.collider(this.submarino_e, this.submarino, (submarino_e, submarino)=> {
  console.log("Colisión con el submarino enemigo o tiburón detectada");
  
  const explosion = this.add.sprite(submarino.x, submarino.y, 'explosion').setOrigin(0.5, 0.5);
  explosion.play('muerte');
  
  submarino.setVisible(false);
  submarino.body.enable = false;

  explosion.on('animationcomplete', () => {
    explosion.destroy();
    submarino.destroy();
  });

  submarino_e.setPosition(200, 200); // O la posición inicial que quieras
  });

  this.physics.add.collider(this.tiburon, this.submarino, (tiburon, submarino) => {
    console.log("Colisión con el tiburón detectada");
    const explosion = this.add.sprite(submarino.x, submarino.y, 'explosion').setOrigin(0.5);
    explosion.play('muerte');
    
    submarino.setVisible(false);
    submarino.body.enable = false;

    explosion.on('animationcomplete', () => {
      explosion.destroy();
      submarino.destroy();
    });

    tiburon.setPosition(100, 100); // Reposicionar
  });

  this.physics.add.collider(this.buso, this.submarino, onHitBuso);

  //this.submarino_e.anims.play("muerte", true);

  this.add.image(150,320, "algas").setOrigin(1,0).setScale(0.2);
  this.add.image(550,330, "algas1").setOrigin(1,0).setScale(0.2);
  this.add.sprite(300, 100, "explosion").setOrigin(0.5, 0.5).setScale(2);

  this.keys = this.input.keyboard.createCursorKeys()

  /* Función para mostrar la explosión y destruir el submarino
  function explodeAndDestroy(submarino, scene) {
    const explosion = scene.add.sprite(submarino.x, submarino.y, 'explosion').setOrigin(0.5, 0.5);
    explosion.play('muerte');
    submarino.setVisible(false);
    scene.time.delayedCall(400, () => {
      explosion.destroy();
      submarino.destroy();
    });
  }*/

/* Colisión con el submarino enemigo y tiburón
  const onHitEnemy = (enemy, submarino) => {
    console.log("Colisión con el submarino enemigo o tiburón detectada");
    const explosion = this.add.sprite(submarino.x, submarino.y, 'explosion').setOrigin(0.5, 0.5);
    explosion.play('muerte');
    
    explosion.on('animationcomplete', () => {
      explosion.destroy();
    });
  */
  
  /*Función de colisión para tiburon y submarino enemigo
  function onHitEnemy(enemy, submarino) {
    console.log("Colisión con el submarino enemigo o tiburón detectada")
    const explosion = this.add.sprite(submarino.x, submarino.y, 'explosion').setOrigin(0.5, 0.5);
    console.log(enemy, submarino);
    explosion.play('muerte')
    
    submarino.setVisible(false);
    submarino.body.enable = false;

    /*explosion.on('animationcomplete', () => {
      submarino.destroy();
      explosion.destroy();
    });

    enemy.setPosition(200, 200); // Cambia a la posición inicial deseada
  }*/

  function onHitBuso(buso, submarino) {
    console.log("Colisión con el buso detectada");
    setTimeout(() => {
      buso.destroy()
    }, 50)
  } 

  const debugGraphic = this.add.graphics().setAlpha(0.75);
  this.physics.world.createDebugGraphic(debugGraphic);

};


function update() {
    if (this.keys.left.isDown) {
    this.submarino.x -= 2
    this.submarino.flipX = true
    } else if (this.keys.right.isDown) {
    this.submarino.x += 2
    this.submarino.flipX = false
    }
    if (this.keys.up.isDown) {
    this.submarino.y -= 2
  } else if (this.keys.down.isDown) {
    this.submarino.y += 2
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

  // Movimiento visual continuo del mar y la espuma
  this.oceano.tilePositionY -= 0.2;
  this.espuma.tilePositionY -= 0.5;

  if (this.burbuja && this.burbuja.y < 75) {
    this.burbuja.destroy()
    console.log("burbuja eliminada en Y < 75")
    this.burbuja = null;
  }

}