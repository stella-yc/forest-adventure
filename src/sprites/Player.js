import Phaser from 'phaser'
import Bullet from '../sprites/Bullet'

export default class Player extends Phaser.Sprite {
  constructor ({ game, x, y, key, frame, controls, spacebar, plantButton }) {
    super(game, x, y, key, frame, controls, spacebar, plantButton)

    this.game = game
    this.anchor.setTo(0.5)
    this.game.physics.arcade.enable(this)

    this.body.gravity.y = 300
    this.body.collideWorldBounds = true

    this.animations.add('left', [0, 1, 2, 3], 10, true)
    this.animations.add('right', [0, 1, 2, 3], 10, true)
    this.animations.add('climb', [6, 7, 8], 10, true)
    this.animations.add('hurt', [9, 10], 10, true)
    this.health = 100
    this.climbing = false
    this.treeTop = false
    this.treeJump = false
    // importing controls from game state
    this.controls = controls
    this.spacebar = spacebar
    this.plantButton = plantButton
    // Bullet
    this.bullets = this.game.add.group()
    this.bullets.enableBody = true
    this.bulletTime = 0
  }

  update () {
    // Moving Player
    this.body.velocity.x = 0
    if (this.controls.left.isDown && !this.climbing && !this.treeTop) {
      this.body.velocity.x = -200
      this.scale.setTo(-1, 1)
      this.animations.play('left')
    }
    else if (this.controls.right.isDown && !this.climbing && !this.treeTop) {
      this.body.velocity.x = 200
      this.scale.setTo(1, 1)
      this.animations.play('right')
    }
    else if (this.body.blocked.down && !this.treetop && !this.treeTop) {
      this.animations.stop()
      this.frame = 2
    }

    if (this.controls.up.isDown && !this.climbing && this.body.blocked.down) {
      this.body.velocity.y = -120
    }

    // shoot
    if (this.spacebar.isDown) {
      this.shoot()
    }

    // Player is climbing
    if (this.climbing) {
      if (this.controls.up.isDown) {
        this.climbing = true
        this.animations.play('climb', 10, true)
        this.body.allowGravity = false
        this.body.velocity.y = -40
      } else {
        if (this.controls.down.isDown) {
          this.body.velocity.y = 40
          this.animations.play('climb', 10, true)
        } else {
          this.animations.stop()
          this.frame = 6
          this.body.velocity.y = 0
        }
      }
      if (this.body.blocked.down) {
        this.climbing = false
        this.body.allowGravity = true
      }
    }

    // Player in tree top
    if (this.treeTop) {
      if (this.controls.left.isDown) {
        this.body.velocity.x = -200
        this.scale.setTo(-1, 1)
        this.frame = 7
      }
      else if (this.controls.right.isDown) {
        this.body.velocity.x = 200
        this.scale.setTo(1, 1)
        this.frame = 7
      }
      else {
        this.animations.stop()
        this.frame = 6
      }
      if (this.body.touching.down) {
        this.treeJump = true
      }
      if (this.controls.up.isDown && this.body.touching.down) {
        this.body.velocity.y = -80
        this.frame = 1
      }
      if (!this.body.touching.down && this.treeJump) {
        this.frame = 1
      }
    }
    if (this.body.blocked.down) {
      this.climbing = false
      this.treeTop = false
      this.body.allowGravity = true
      this.treeJump = false
    }
  } // end of update

  shoot () {
    if (this.game.time.now > this.bulletTime) {
      let bullet = this.bullets.getFirstExists(false)
      var start = this.centerX
      if (!bullet) {
        bullet = new Bullet({
          game: this.game,
          x: start,
          y: this.centerY,
          health: 3,
          asset: 'bullet'
        })
        this.bullets.add(bullet)
      } else {
        bullet.reset(this.centerX, this.centerY, 3)
      }
      if (this.scale.x < 0) {
        bullet.body.velocity.x = -200
      } else {
        bullet.body.velocity.x = 200
      }
      if (Math.abs(bullet.x - start) > 10) {
        bullet.kill()
      }
      this.bulletTime = this.game.time.now + 250
    }
  }

  takeDamage (player, enemy) {
    player.tint = 0xff00ff
    let tween = this.game.add.tween(player)

    tween.to({ tint: 0xff0000 }, 300)
    tween.onComplete.add(() => {
      player.tint = 0xffffff
    })
    let motionTween = this.game.add.tween(player)
    motionTween.to({ y: player.y - 30, x: player.x - 30}, 150)
    tween.start()
    motionTween.start()

    player.health = player.health - 3
    if (player.health < 0) {
      player.health = 0

      this.game.add.tween(this.black).to( { alpha: 1 }, 2000, "Linear", true);
      let tween = this.game.add.tween(this.black)
      tween.to({ alpha: 1 }, 300)
      tween.onComplete.add(() => {
        this.loseText.visible = true
        this.game.world.bringToTop(this.button)
        this.game.world.bringToTop(this.buttonText)
        this.button.visible = true
        this.buttonText.visible = true
      })
      tween.start()
    }
    this.myHealthBar.setPercent(this.player.health)
    // this.healthNumber.text = `${this.player.health}`

    player.body.velocity.x = -player.body.velocity.x
  }

  die (player, spike) {
    player.frame = 9
    player.animations.play('hurt', 10, true)
    player.tint = 0xff00ff
    let tween = this.game.add.tween(player)
    tween.to({ tint: 0xff0000 }, 300)
    tween.onComplete.add(() => {
      player.tint = 0xffffff
    })

    player.health = player.health - 3
    if (player.health < 0) {
      player.health = 0
      this.game.add.tween(this.black).to( { alpha: 1 }, 2000, "Linear", true);
      let tween = this.game.add.tween(this.black)

      tween.to({ alpha: 1 }, 300)
      tween.onComplete.add(() => {
        this.loseText.visible = true
        this.button.visible = true
        this.buttonText.visible = true
      })
      tween.start()
    }
    this.myHealthBar.setPercent(this.player.health)
  }

  climb (player, tree) {
    if (this.cursors.up.isDown) {
      player.climbing = true
      player.animations.play('climb', 10, true)
      player.body.allowGravity = false
      player.body.velocity.y = -40
    }
  }

  topOfTree (player, tree) {
    player.frame = 6
    player.body.allowGravity = true
    player.climbing = false
    player.treeTop = true
  }
}
