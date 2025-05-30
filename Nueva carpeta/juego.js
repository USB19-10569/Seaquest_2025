const config = {
   type: Phaser.AUTO,
    width: 600,
    height: 400,
    backgroundColor: "#049cd8",
    parent: 'juego',
    physics: {},
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

new Phaser.Game(config);

function preload() {
  this.load.image("oceano", "./assets/scenery/oceano.png");

  this.load.image("espuma", "./assets/scenery/espuma.png");

  this.load.image("peces", "./assets/scenery/peces.png");

  this.load.image("peces1", "./assets/scenery/peces1.png");

  this.load.image("algas", "./assets/scenery/algas.png")

  this.load.image("algas1", "./assets/scenery/algas1.png")

  this.load.image("submarino", "./assets/scenery/submarino.png");
   /* this.load.spritesheet('explosion', './assets/scenery/explosion.png',
        {frameWidth: 80, frameHeight: 80}
    )*/

  this.load.image("tiburon", "./assets/scenery/tiburon.png");

  this.load.image("piso", "./assets/scenery/piso.png");
  


};

function create() {
  this.add.image(0,80, "oceano").setOrigin(0,0).setScale(19);

  this.add.image(1,70, "espuma").setOrigin(0,0).setScale(10);

  this.add.image(1,150, "peces").setOrigin(0,0).setScale(1.2);

  this.add.image(555,250, "peces1").setOrigin(0,0).setScale(1.3);

  this.submarino = this.add.image(300, 200, 'submarino').setOrigin(0.5, 0.5).setScale(1.5);
   /* this.explosion = this.add.sprite(100, 100, 'explosion',).setOrigin(0, 1)
    */

  this.add.image(100, 100, "tiburon").setOrigin(1,0).setScale(1.2);

  this.add.image(150,320, "algas").setOrigin(1,0).setScale(2);

  this.add.image(550,320, "algas1").setOrigin(1,0).setScale(2);

  this.add.image(0,380, "piso").setOrigin(0,0).setScale(19)

  this.keys = this.input.keyboard.createCursorKeys()
};

function update() {
    if (this.keys.left.isDown) {
    this.submarino.x -= 2
    } else if (this.keys.right.isDown) {
    this.submarino.x += 2
    }
    if (this.keys.up.isDown) {
    this.submarino.y -= 2
  } else if (this.keys.down.isDown) {
    this.submarino.y += 2
  } 
    /*if (this.keys.left.isDown) {
    this.mario.anims.play('mario-walk', true)
    this.mario.x -= 2
    this.mario.flipX = true
  } else if (this.keys.right.isDown) {
    this.mario.anims.play('mario-walk', true)
    this.mario.x += 2
    this.mario.flipX = false
  }
  if (this.keys.up.isDown) {
    this.mario.anims.play('mario-jump', true)
    this.mario.y -= 2
  } else if (this.keys.down.isDown) {
    this.mario.anims.play('mario-crouch', true)
    this.mario.y += 2
  } else {
    this.mario.anims.stop()
  }*/
};
