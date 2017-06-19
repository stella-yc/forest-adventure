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
    this.game.world.setBounds(0, 0, 3040, 192)

    // Sky
    var skyTile = this.game.add.tileSprite(0, 0, 288, 192, 'sky')
    skyTile.fixedToCamera = true

    // Tile map
    this.map = this.game.add.tilemap('tileMap-2000-400')
    this.map.addTilesetImage('sunnyLand', 'sunnyLand')
    this.backgroundlayer = this.map.createLayer('BackgroundLayer')
    this.groundLayer = this.map.createLayer('GroundLayer')
    this.map.setCollisionBetween(1, 600, true, 'GroundLayer')
    this.groundLayer.immovable = true
    this.groundLayer.resizeWorld()

    // Hidden Platforms
    this.trunks = this.game.add.group()
    this.trunks.enableBody = true
    this.hiddenPlatforms = this.game.add.group()
    this.hiddenPlatforms.enableBody = true
    this.topPlatforms = this.game.add.group()
    this.topPlatforms.enableBody = true

    // Spikes
    this.spikes = this.game.add.group()
    this.spikes.enableBody = true
    var spike = this.spikes.create(952, 342, 'spikes')
    spike = this.spikes.create(952 + 17, 342, 'spikes')
    spike = this.spikes.create(952 + 17 + 17, 342, 'spikes')
    spike = this.spikes.create(1112, 342, 'spikes')
    spike = this.spikes.create(1112 + 17, 342, 'spikes')
    spike = this.spikes.create(1112 + 17 + 17, 342, 'spikes')

    // Player
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'player')
    this.player.anchor.setTo(0.5)
    this.game.physics.arcade.enable(this.player)
    // this.player.body.bounce.y = 0.3
    // this.player.body.bounce.x = 0.9
    this.player.body.gravity.y = 300
    this.player.body.collideWorldBounds = true
    this.player.animations.add('left', [0, 1, 2, 3, 4, 5], 10, true)
    this.player.animations.add('right', [0, 1, 2, 3, 4, 5], 10, true)
    this.player.animations.add('climb', [6, 7, 8], 10, true)

    this.player.health = 100
    this.player.climbing = false
    this.player.treeTop = false

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
    var locations = [1050, 1350]
    for (var i = 0; i < locations.length; i++) {
      var cherry = this.cherries.create(locations[i], 0, 'cherry')
      cherry.body.gravity.y = 300
      cherry.body.bounce.y = 0.2
    }

    // Gems
    this.gems = this.game.add.group()
    this.gems.enableBody = true
    var gem = this.gems.create(500, 335, 'gem')
    gem = this.gems.create(1220, 195, 'gem')
    gem = this.gems.create(1690, 195, 'gem')
    gem = this.gems.create(1800, 335, 'gem')
    gem = this.gems.create(2650, 230, 'gem')
    this.gemCounter = 0

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
      x: 435,
      y: 0,
      key: 'blueBot',
      frame: 0,
      rightbound: 550,
      leftbound: 440
    })
    this.game.physics.arcade.enable(this)
    this.bots.add(bot)
    bot = new Bot({
      game: this.game,
      x: 1600,
      y: 0,
      key: 'blueBot',
      frame: 0,
      rightbound: 1700,
      leftbound: 1620
    })
    this.game.physics.arcade.enable(this)
    this.bots.add(bot)
    // bot = new Bot({
    //   game: this.game,
    //   x: 1640,
    //   y: 0,
    //   key: 'blueBot',
    //   frame: 0,
    //   rightbound: 1800,
    //   leftbound: 1650
    // })
    // this.game.physics.arcade.enable(this)
    // this.bots.add(bot)

    bot = new Bot({
      game: this.game,
      x: 2360,
      y: 0,
      key: 'blueBot',
      frame: 0,
      rightbound: 2400,
      leftbound: 2370
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

    // Win Text
    this.winText = this.game.add.text(80, 40, 'You Win!', { font: "30px Arial", fill: "#000000", align: "center" })
    this.winText.fixedToCamera = true
    this.winText.visible = false

    // Lose Text
    this.black = this.game.add.sprite(0, 0, 'black')
    this.black.alpha = 0
    this.loseText = this.game.add.text(80, 40, 'You Lose!', { font: "30px Arial", fill: "#ffffff", align: "center" })
    this.loseText.fixedToCamera = true
    this.loseText.visible = false
  }

  update () {
    // Physics
    this.game.physics.arcade.collide(this.player, this.groundLayer)
    this.game.physics.arcade.collide(this.cherries, this.groundLayer)
    this.game.physics.arcade.collide(this.bots, this.groundLayer)
    this.game.physics.arcade.collide(this.cat, this.groundLayer)
    this.game.physics.arcade.collide(this.gems, this.groundLayer)
    this.game.physics.arcade.collide(this.trees, this.groundLayer)
    this.game.physics.arcade.collide(this.player, this.hiddenPlatforms)

    this.game.world.bringToTop(this.trunks)
    this.game.world.bringToTop(this.hiddenPlatforms)
    this.game.world.bringToTop(this.topPlatforms)
    this.game.world.bringToTop(this.player)

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
    this.game.physics.arcade.overlap(this.player, this.trunks, this.climb, null, this)
    // Restore gravity on tree
    this.game.physics.arcade.overlap(this.player, this.topPlatforms, this.topOfTree, null, this)


    // Moving Player
    this.player.body.velocity.x = 0

    if (this.cursors.left.isDown && !this.player.climbing) {
      this.player.body.velocity.x = -200
      this.player.scale.setTo(-1, 1)
      this.player.animations.play('left')
    }
    else if (this.cursors.right.isDown && !this.player.climbing) {
      this.player.body.velocity.x = 200
      this.player.scale.setTo(1, 1)
      this.player.animations.play('right')
    }
    else if (this.player.body.blocked.down || !this.player.climbing) {
      this.player.animations.stop()
      this.player.frame = 2
    }

    if (this.cursors.up.isDown && !this.player.climbing && this.player.body.blocked.down) {
      this.player.body.velocity.y = -120
    }

    // shoot
    if (this.spaceKey.isDown) {
      this.shoot()
    }

    // plant tree
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
    // if (this.health === 0) {
    //   this.state.start('Over')
    // }

    // end of update
  }

/// HELPER FUNCTIONS

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
    this.gemCounter++
    gem.kill()
    for (var i = 0; i < this.scoreGems.length; i++) {
      if (!this.scoreGems[i].found) {
        this.scoreGems[i].found = true
        this.scoreGems[i].tint = 0xFFFFFF
        break
      }
    }
    if (this.gemCounter === 5) {
      this.winText.visible = true
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
    if (this.player.health < 0) {
      this.player.health = 0
      this.game.add.tween(this.black).to( { alpha: 1 }, 2000, "Linear", true);
      let tween = this.game.add.tween(this.black)

      tween.to({ alpha: 1 }, 300)
      tween.onComplete.add(() => {
        this.loseText.visible = true
      })
      tween.start()
    }
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
        bullet.body.velocity.x = -200
      } else {
        bullet.body.velocity.x = 200
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
        y: this.player.y + 16,
        health: 3,
        key: 'tree'
      })
      this.trees.add(tree)

      tree.hiddenPlatform = this.hiddenPlatforms.create(location, tree.y - 60, 'hiddenPlatform')
      tree.hiddenPlatform.anchor.setTo(0.5)
      tree.hiddenPlatform.body.checkCollision.up = true
      tree.hiddenPlatform.body.checkCollision.down = false
      tree.hiddenPlatform.body.immovable = true
      tree.hiddenPlatform.alpha = 0
      tree.topPlatform = this.topPlatforms.create(location, tree.y - 90, 'treeTop')
      tree.topPlatform.anchor.setTo(0.5)
      tree.topPlatform.alpha = 0
      tree.trunk = this.trunks.create(location, tree.y - 30, 'treeTrunk')
      tree.trunk.anchor.setTo(0.5, 0.5)
      tree.trunk.alpha = 0
      this.plantTime = this.game.time.now + 2000
    }
  }

  climb (player, tree) {
    if (this.cursors.up.isDown) {
      console.log('this.player.body in climb', this.player.body)
      this.player.climbing = true
      this.player.animations.play('climb', 10, true)
      this.player.body.gravity.y = 0
      this.player.body.velocity.y = -40
    } else {
      if (this.player.climbing) {

        this.player.animations.stop()
        this.player.frame = 6
        this.player.body.velocity.y = 0

        if (this.cursors.left.isDown) {
          this.player.body.velocity.y = 0
        }
        if (this.cursors.down.isDown) {
          this.player.body.velocity.y = 40
        }
        if (this.player.body.blocked.down) {
          this.player.climbing = false
        }
      }
    }
  }

  topOfTree () {
    // console.log('this.player.body in topOfTree', this.player.body)
    this.player.frame = 6
    this.player.body.gravity.y = 300
    this.player.climbing = false
    this.player.treeTop = true

    if (this.cursors.left.isDown) {
      console.log('***left is down')
      this.player.body.velocity.x = -200
      this.player.scale.setTo(-1, 1)
      this.player.animations.play('climb')
    }
    else if (this.cursors.right.isDown) {
      console.log('***right is down')
      this.player.body.velocity.x = 200
      this.player.scale.setTo(1, 1)
      this.player.animations.play('climb')
    }
    else {
      this.player.animations.stop()
      this.player.frame = 6
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -80
    }
  }

  checkOverlap (spriteA, spriteB) {
    var boundsA = spriteA.getBounds()
    var boundsB = spriteB.getBounds()
    return Phaser.Rectangle.intersects(boundsA, boundsB)
  }

  render () {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.player, 32, 32)
    // }
  }
} // end of state object
