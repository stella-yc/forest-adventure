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
    if (this.controls.left.isDown && !this.climbing) {
      this.body.velocity.x = -200
      this.scale.setTo(-1, 1)
      this.animations.play('left')
    }
    else if (this.controls.right.isDown && !this.climbing) {
      this.body.velocity.x = 200
      this.scale.setTo(1, 1)
      this.animations.play('right')
    }
    else if (this.body.blocked.down && !this.treetop) {
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


}
