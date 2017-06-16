import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)

    this.game = game

    this.anchor.setTo(0.5)
    this.scale.setTo(2, 2)
    this.game.physics.arcade.enable(this)

    this.body.bounce.y = 0.2
    this.body.gravity.y = 300
    this.body.collideWorldBounds = true

    this.animations.add('left', [0, 1, 2, 3], 10, true)
    this.animations.add('right', [0, 1, 2, 3], 10, true)

  }

  update () {

  }
}
