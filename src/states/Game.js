/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {
  init () { }
  preload () {
    this.load.spritesheet('player', 'assets/payer-run.png', 32, 32)
  }

  create () {
    // Start world
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.world.setBounds(0, 0, 1980, 600)

    // Sky

    var skyTile = this.game.add.tileSprite(0, 0, 1000, 600, 'sky')
    skyTile.scale.setTo(2.4)

    // Platforms

    this.platforms = this.game.add.group()
    this.platforms.enableBody = true
    var ground = this.platforms.create(0, this.game.world.height - 64, 'ground')
    ground.scale.setTo(2, 2)
    ground.scale.x = 1920
    ground.body.immovable = true

    var ledge = this.platforms.create(600, 400, 'ground')
    ledge.body.immovable = true
    ledge = this.platforms.create(900, 250, 'ground')
    ledge.body.immovable = true
    ledge = this.platforms.create(1050, 100, 'ground')
    ledge.body.immovable = true

    // Player

    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'player')
    this.player.scale.setTo(2, 2)
    this.player.anchor.setTo(0.5)
    this.game.physics.arcade.enable(this.player)
    this.player.body.bounce.y = 0.2
    this.player.body.gravity.y = 300
    this.player.body.collideWorldBounds = true
    this.player.animations.add('left', [0, 1, 2, 3], 10, true)
    this.player.animations.add('right', [0, 1, 2, 3], 10, true)

    // this.player = new Player({
    //   game: this,
    //   x: 32,
    //   y: this.game.world.height - 150,
    //   asset: 'player'
    // })

    // this.game.add.existing(this.player)

    // Camera
    this.game.camera.follow(this.player)

    // Cherries
    this.cherries = this.game.add.group()
    this.cherries.enableBody = true

    var locations = [500, 700, 1800, 1000, 1600]
    for (var i = 0; i < 5; i++) {
      var cherry = this.cherries.create(locations[i], 0, 'cherry')
      cherry.scale.setTo(2, 2)
      cherry.body.gravity.y = 300
      cherry.body.bounce.y = 0.2
    }

    // Score
    this.score = 0
    this.scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })
    this.scoreText.fixedToCamera = true

    // Health
    this.health = 100
    this.healthText = this.game.add.text(16, 50, 'health: 100', { fontSize: '32px', fill: '#000' })
    this.healthText.fixedToCamera = true

    // Controls
    this.cursors = this.game.input.keyboard.createCursorKeys()

  }

  update () {
    // Physics

    this.game.physics.arcade.collide(this.player, this.platforms)
    this.game.physics.arcade.collide(this.cherries, this.platforms)

    // Moving Player

    this.player.body.velocity.x = 0

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -200
      this.player.scale.setTo(-2, 2)
      this.player.animations.play('left')
    }
    else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 200
      this.player.scale.setTo(2, 2)
      this.player.animations.play('right')
    }
    else {
      this.player.animations.stop()
      this.player.frame = 2
    }
    //  Allow the player to jump if they are touching the ground.
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -350
    }

    // eat a cherry
    this.game.physics.arcade.overlap(this.player, this.cherries, this.collectFruit, null, this)

    if (this.health === 0) {
      this.state.start('Over')
    }
  }

  collectFruit (player, cherry) {
    cherry.kill()
    this.health += 10
    this.healthText.text = 'health: ' + this.health
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }
}
