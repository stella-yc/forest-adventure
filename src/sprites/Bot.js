import Phaser from 'phaser'
export default class Bot extends Phaser.Sprite {

  constructor ({ game, x, y, key, frame, leftbound, rightbound }) {
    super(game, x, y, key, frame)

    this.anchor.setTo(0.5)
    this.game.physics.arcade.enable(this)
    this.body.bounce.y = 0.2
    this.body.gravity.y = 300
    this.body.collideWorldBounds = true
    // this.animations.add('run', [33, 34, 35, 36, 37, 38], 8, true)
    // this.animations.add('run', [17, 18, 19, 20, 21, 22], 8, true)
    this.animations.add('run', [0, 1, 2, 3, 4], 8, true)
    this.health = 100
    this.leftbound = leftbound
    this.rightbound = rightbound
  }

  update () {
    this.animations.play('run')
    if (this.position.x >= this.rightbound) {
      this.body.velocity.x = -100
      this.scale.setTo(1, 1)
    }

    if (this.position.x <= this.leftbound) {
      this.body.velocity.x = 100
      this.scale.setTo(-1, 1)
    }

  }
}
