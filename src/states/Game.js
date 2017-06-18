/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Bullet from '../sprites/Bullet'
import Bot from '../sprites/Bot'
import HealthBar from '../HealthBar'
import Tree from '../sprites/Tree'

export default class extends Phaser.State {
  init () { }
  preload () {
    this.game.load.tilemap('tileMap-2000-400', 'assets/tileMap-2000-400.json', null, Phaser.Tilemap.TILED_JSON)
    this.game.load.image('sunnyLand', 'assets/images/tileset.png')
  }

  create () {
    // Start world
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.world.setBounds(0, 0, 2000, 192)

    // Sky
    var skyTile = this.game.add.tileSprite(0, 0, 288, 192, 'sky')
    skyTile.fixedToCamera = true

    this.map = this.game.add.tilemap('tileMap-2000-400')
    this.map.addTilesetImage('sunnyLand', 'sunnyLand')

    console.log('this.map', this.map)
    this.backgroundlayer = this.map.createLayer('BackgroundLayer')


    this.groundLayer = this.map.createLayer('GroundLayer')
    this.map.setCollisionBetween(1, 100, true, 'GroundLayer')
    this.groundLayer.resizeWorld()


    // var groundTile = this.game.add.tileSprite(0, 0, 16, 16, 'groundTile')
    // groundTile.scale.setTo(2)
    // groundTile.tileScale.x = 4
    // groundTile.tileScale.y = 4

    // Platforms
    // this.platforms = this.game.add.group()
    // this.platforms.enableBody = true
    // this.platforms.visible = false
    // var ground = this.platforms.create(0, this.game.world.height - 64, 'ground')
    // ground.scale.setTo(2, 2)
    // ground.scale.x = 1920
    // ground.body.immovable = true

    // var ledge = this.platforms.create(600, 400, 'ground')
    // ledge.body.immovable = true
    // ledge = this.platforms.create(900, 250, 'ground')
    // ledge.body.immovable = true
    // ledge = this.platforms.create(1050, 100, 'ground')
    // ledge.body.immovable = true

    // Spikes
    this.spikes = this.game.add.group()
    this.spikes.enableBody = true
    var spike = this.spikes.create(600, 550, 'spikes')
    spike = this.spikes.create(640, 550, 'spikes')

    // Player
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'player')
    this.player.anchor.setTo(0.5)
    this.game.physics.arcade.enable(this.player)
    this.player.body.bounce.y = 0.3
    this.player.body.bounce.x = 0.9
    this.player.body.gravity.y = 300
    this.player.body.collideWorldBounds = true
    this.player.animations.add('left', [0, 1, 2, 3], 10, true)
    this.player.animations.add('right', [0, 1, 2, 3], 10, true)
    this.player.health = 100
    this.game.camera.follow(this.player)
    this.player.climbing = false

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
      cherry.body.gravity.y = 300
      cherry.body.bounce.y = 0.2
    }

    // Gems
    this.gems = this.game.add.group()
    this.gems.enableBody = true
    var gemLocations = [600, 900, 1100, 1900, 400]
    for (var j = 0; j < 5; j++) {
      var gem = this.gems.create(gemLocations[j], 200, 'gem')
      gem.body.gravity.y = 300
    }

    // Score Gems
    this.scoreGems = []
    for (var k = 1; k < 6; k++) {
      var scoreGem = this.gems.create(140 + (22 * k), 10, 'gem')
      scoreGem.scale.setTo(1.2, 1.2)
      scoreGem.tint = 0x000000
      scoreGem.found = false
      scoreGem.fixedToCamera = true
      this.scoreGems.push(scoreGem)
    }
    this.scoreGems.fixedToCamera = true


    // Enemy
    this.bots = this.game.add.group()
    this.bots.enableBody = true
    var bot = new Bot({
      game: this.game,
      x: 600,
      y: 0,
      key: 'blueBot',
      frame: 0,
      rightbound: 500,
      leftbound: 300
    })
    this.game.physics.arcade.enable(this)
    this.bots.add(bot)
    bot = new Bot({
      game: this.game,
      x: 1100,
      y: 0,
      key: 'blueBot',
      frame: 0,
      rightbound: 1000,
      leftbound: 700
    })
    this.game.physics.arcade.enable(this)
    this.bots.add(bot)

    // Cat
    this.cat = this.game.add.sprite(150, 0, 'cat', 0)
    this.cat.anchor.setTo(0.5)
    this.game.physics.arcade.enable(this.cat)
    this.cat.body.bounce.y = 0.2
    this.cat.body.gravity.y = 300
    this.cat.body.collideWorldBounds = true
    this.cat.animations.add('left', [0, 1, 2, 3], 10, true)
    this.cat.animations.add('right', [0, 1, 2, 3], 10, true)
    this.cat.health = 100

    // Health Bar
    var barConfig = {x: 60, y: 20}
    this.myHealthBar = new HealthBar(this.game, barConfig)
    this.myHealthBar.setFixedToCamera(true)
    this.border = this.game.add.sprite(5, 10, 'healthbarBorder')
    this.border.fixedToCamera = true
    this.healthNumber = this.game.add.text(10, 30, `${this.player.health}`, { font: "16px Arial", fill: "#000000", align: "center" })
    this.healthNumber.fixedToCamera = true

    // Bullet
    this.bullets = this.game.add.group()
    this.bullets.enableBody = true
    this.bulletTime = 0

    // Plant Tree
    this.trees = this.game.add.group()
    this.trees.enableBody = true
    this.plantTime = 0

    // Controls
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.letterC = this.game.input.keyboard.addKey(Phaser.Keyboard.C)

  }

  update () {
    // Physics
    this.game.physics.arcade.collide(this.player, this.groundLayer)
    this.game.physics.arcade.collide(this.cherries, this.groundLayer)
    this.game.physics.arcade.collide(this.bots, this.groundLayer)
    this.game.physics.arcade.collide(this.cat, this.groundLayer)
    this.game.physics.arcade.collide(this.gems, this.groundLayer)
    this.game.physics.arcade.collide(this.trees, this.groundLayer)


    // Touch enemy
    this.game.physics.arcade.collide(this.player, this.bots, this.takeDamage, null, this)
    // Eat Cherries
    this.game.physics.arcade.overlap(this.player, this.cherries, this.collectFruit, null, this)
    // Destroy Enemy
    this.game.physics.arcade.overlap(this.bots, this.bullets, this.destroyEnemy, null, this)
    // Spikes
    this.game.physics.arcade.overlap(this.player, this.spikes, this.takeDamage, null, this)
    // Find Gem
    this.game.physics.arcade.overlap(this.player, this.gems, this.updateGemScore, null, this)
    // Climb Tree
    this.game.physics.arcade.overlap(this.player, this.trees, this.climb, null, this)

    // Moving Player
    this.player.body.velocity.x = 0

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -200
      this.player.scale.setTo(-1, 1)
      this.player.animations.play('left')
    }
    else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 200
      this.player.scale.setTo(1, 1)
      this.player.animations.play('right')
    }
    else {
      this.player.animations.stop()
      this.player.frame = 2
    }
    //  Allow the player to jump if they are touching the ground.
    // if (this.cursors.up.isDown && this.player.body.touching.down) {
    //   this.player.body.velocity.y = -350
    // }
    if (this.cursors.up.isDown && !this.player.climbing) {
      this.player.body.velocity.y = -100
    }

    // shoot
    if (this.spaceKey.isDown) {
      this.shoot()
    }

    // plant tree
    if (this.letterC.isDown) {

    }

    var flipFlop
    if (this.letterC.isDown) {
      if (!flipFlop) {
        this.plantTree()
        flipFlop = true
      }
    }

    if (this.letterC.isUp) {
      flipFlop = false
    }

    // end game
    if (this.health === 0) {
      this.state.start('Over')
    }

    // end of update
  }

  collectFruit (player, cherry) {
    cherry.kill()
    this.player.health += 10
    if (this.player.health > 100) {
      this.player.health = 100
    }
    this.myHealthBar.setPercent(this.player.health)
    this.healthNumber.text = `${this.player.health}`
  }

  updateGemScore (player, gem) {
    gem.kill()
    for (var i = 0; i < this.scoreGems.length; i++) {
      if (!this.scoreGems[i].found) {
        this.scoreGems[i].found = true
        this.scoreGems[i].tint = 0xFFFFFF
        return
      }
    }
  }

  takeDamage (player, enemy) {
    this.player.tint = 0xff00ff
    let tween = this.game.add.tween(player)

    tween.to({ tint: 0xff0000 }, 300)
    tween.onComplete.add(() => {
      player.tint = 0xffffff
    })
    tween.start()

    this.player.health = this.player.health - 3
    this.myHealthBar.setPercent(this.player.health)
    this.healthNumber.text = `${this.player.health}`

    if (player.body.velocity.x > 0) {
      player.x = player.x + 50
      player.y = this.game.world.height - 80
    }

    if (player.body.velocity.x < 0) {
      player.x = player.x - 50
      player.y = this.game.world.height - 80
    }

    player.body.velocity.x = -player.body.velocity.x
  }

  shoot () {
    if (this.game.time.now > this.bulletTime) {
      let bullet = this.bullets.getFirstExists(false)
      if (!bullet) {
        bullet = new Bullet({
          game: this.game,
          x: this.player.centerX,
          y: this.player.centerY,
          health: 3,
          asset: 'bullet'
        })
        this.bullets.add(bullet)
      } else {
        bullet.reset(this.player.centerX, this.player.centerY, 3)
      }
      if (this.player.scale.x < 0) {
        bullet.body.velocity.x = -300
      } else {
        bullet.body.velocity.x = 300
      }
      this.bulletTime = this.game.time.now + 250
    }
  }

  destroyEnemy (bullet, enemy) {
    enemy.kill()
    bullet.kill()
  }

  plantTree () {
    if (this.game.time.now > this.plantTime) {
      var right = this.player.scale.x > 0
      var location
      if (right) {
        location = this.player.x + 30
      } else {
        location = this.player.x - 30
      }
      var tree = new Tree({
        game: this.game,
        x: location,
        y: 305,
        health: 3,
        key: 'tree'
      })
      this.trees.add(tree)
      this.plantTime = this.game.time.now + 2000
    }
  }

  climb () {
    if (this.cursors.up.isDown) {
      this.player.climbing = true
      this.player.body.gravity.y = 0
      // this.player.y = this.player.y++
      this.player.body.moveUp(20)
    } else {
      this.player.climbing = false
    }
  }

  render () {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.player, 32, 32)
    // }
  }
} // end of state object
