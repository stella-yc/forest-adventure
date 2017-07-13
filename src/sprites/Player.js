import Phaser from 'phaser'

export default class Player extends Phaser.Sprite {
  constructor ({ game, x, y, key, frame }) {
    super(game, x, y, key, frame)

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
  }

  update () {
    // // Moving Player
    // this.body.velocity.x = 0
    // console.log('this', this)
    // if (this.cursors.left.isDown && !this.climbing) {
    //   this.body.velocity.x = -200
    //   this.scale.setTo(-1, 1)
    //   this.animations.play('left')
    // }
    // else if (this.cursors.right.isDown && !this.climbing) {
    //   this.body.velocity.x = 200
    //   this.scale.setTo(1, 1)
    //   this.animations.play('right')
    // }
    // else if (this.body.blocked.down || !this.climbing) {
    //   this.animations.stop()
    //   this.frame = 2
    // }

    // if (this.cursors.up.isDown && !this.climbing && this.body.blocked.down) {
    //   this.body.velocity.y = -120
    // }

  }
}
