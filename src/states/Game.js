import Phaser from 'phaser'
import Player from '../sprites/Player'
import Bullet from '../sprites/Bullet'
import Bot from '../sprites/Bot'
import HealthBar from '../HealthBar'
import Tree from '../sprites/Tree'

export default class extends Phaser.State {
  init () { }
  preload () {
    this.game.load.tilemap('tileMap-2000-400', 'assets/tileMap-debug.json', null, Phaser.Tilemap.TILED_JSON)
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
    this.spikeWidth = 17
    const spikeMaker = (xCoord, yCoord, quantity) => {
      for (let i = 0; i < quantity; i++) {
        this.spikes.create(xCoord, yCoord, 'spikes')
        xCoord += this.spikeWidth
      }
    }
    spikeMaker(952, 342, 3)
    spikeMaker(1112, 342, 3)

    // Controls
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.letterC = this.game.input.keyboard.addKey(Phaser.Keyboard.C)

    // Player (Fox Sprite)
    this.player = new Player({
      game: this.game,
      x: 32,
      y: this.game.world.height - 150,
      key: 'player',
      frame: 0,
      controls: this.cursors,
      spacebar: this.spaceKey,
      plantButton: this.letterC
    })
    this.game.add.existing(this.player)

    // Camera
    this.game.camera.follow(this.player)

    // Cherries
    this.cherries = this.game.add.group()
    this.cherries.enableBody = true
    const locations = [1050, 1350]
    for (let i = 0; i < locations.length; i++) {
      let cherry = this.cherries.create(locations[i], 0, 'cherry')
      cherry.body.gravity.y = 300
      cherry.body.bounce.y = 0.2
    }

    // Gems
    this.gems = this.game.add.group()
    this.gems.enableBody = true
    const gemLocations = [
      {x: 500, y: 335},
      {x: 1220, y: 240},
      {x: 1740, y: 195},
      {x: 1820, y: 330},
      {x: 2650, y: 230}
    ]
    gemLocations.forEach(gem => this.gems.create(gem.x, gem.y, 'gem'))
    this.gemCounter = 0

    // Score Gems
    this.scoreGems = []
    for (let k = 1; k < 6; k++) {
      let scoreGem = this.gems.create(140 + (22 * k), 10, 'gem')
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
      x: 1400,
      y: 0,
      key: 'blueBot',
      frame: 0,
      rightbound: 1480,
      leftbound: 1410
    })
    this.game.physics.arcade.enable(this)
    this.bots.add(bot)
    bot = new Bot({
      game: this.game,
      x: 2360,
      y: 0,
      key: 'blueBot',
      frame: 0,
      rightbound: 2430,
      leftbound: 2370
    })
    this.game.physics.arcade.enable(this)
    this.bots.add(bot)

    // Health Bar
    var barConfig = {x: 60, y: 20}
    this.myHealthBar = new HealthBar(this.game, barConfig)
    this.myHealthBar.setFixedToCamera(true)
    this.border = this.game.add.sprite(5, 10, 'healthbarBorder')
    this.border.fixedToCamera = true

    // Plant Tree
    this.trees = this.game.add.group()
    this.trees.enableBody = true
    this.plantTime = 0

    // Win Text
    this.winText = this.game.add.text(80, 40, 'You Win!', { font: "30px Cabin Sketch", fill: "#000000", align: "center" })
    this.winText.fixedToCamera = true
    this.winText.visible = false

    // Lose Text
    this.black = this.game.add.sprite(0, 0, 'black')
    this.black.alpha = 0
    this.loseText = this.game.add.text(80, 40, 'You Lose!', { font: "30px Cabin Sketch", fill: "#ffffff", align: "center" })
    this.loseText.fixedToCamera = true
    this.loseText.visible = false
    this.button = this.game.add.button(150, this.game.world.centerY + 160, 'crate-button', this.startGame, this, 2, 1, 0)
    this.button.anchor.setTo(0.5)
    this.buttonText = this.game.add.text(150, this.game.world.centerY + 163, 'Try Again', { font: "12px Cabin Sketch", fill: "#000000", align: "center" })
    this.buttonText.anchor.setTo(0.5)
    this.button.visible = false
    this.buttonText.visible = false
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
    this.game.world.bringToTop(this.myHealthBar)
    this.game.world.bringToTop(this.player)

    // Touch enemy
    this.game.physics.arcade.collide(this.player, this.bots, this.player.takeDamage, null, this)
    // Eat Cherries
    this.game.physics.arcade.overlap(this.player, this.cherries, this.collectFruit, null, this)
    // Destroy Enemy
    this.game.physics.arcade.overlap(this.bots, this.player.bullets, this.destroyEnemy, null, this)
    // Spikes
    this.game.physics.arcade.overlap(this.player, this.spikes, this.player.die, null, this)
    // Find Gem
    this.game.physics.arcade.overlap(this.player, this.gems, this.updateGemScore, null, this)
    // Climb Tree
    this.game.physics.arcade.overlap(this.player, this.trunks, this.player.climb, null, this)
    // Restore gravity on tree top
    this.game.physics.arcade.overlap(this.player, this.topPlatforms, this.player.topOfTree, null, this)

    // plant tree
    let flipFlop
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
  } // end of update
  render () {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.player, 32, 32)
    // }
  }
/// *********** HELPER FUNCTIONS ************** ///

  collectFruit (player, cherry) {
    cherry.kill()
    this.player.health += 10
    if (this.player.health > 100) {
      this.player.health = 100
    }
    this.myHealthBar.setPercent(this.player.health)
    // this.healthNumber.text = `${this.player.health}`
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

  destroyEnemy (enemy, bullet) {
    enemy.health = enemy.health - 10
    let hurtTween = this.game.add.tween(enemy)

    hurtTween.to({ tint: 0xff0000 }, 300)
    hurtTween.onComplete.add(() => {
      enemy.tint = 0xffffff
    })
    hurtTween.start()
    if (enemy.health <= 0) {
      enemy.kill()
    }
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

  checkOverlap (spriteA, spriteB) {
    var boundsA = spriteA.getBounds()
    var boundsB = spriteB.getBounds()
    return Phaser.Rectangle.intersects(boundsA, boundsB)
  }

  startGame () {
    this.state.start('Game')
  }
} // end of state object

