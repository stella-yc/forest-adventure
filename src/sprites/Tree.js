import Phaser from 'phaser'
export default class Tree extends Phaser.Sprite {

  constructor ({ game, x, y, key, frame }) {
    super(game, x, y, key, frame)

    this.anchor.setTo(0.5, 1)
    this.game.physics.arcade.enable(this)
    this.body.gravity.y = 300
    this.body.collideWorldBounds = true
    this.scale.setTo(0.1, 0.1)
    game.add.tween(this.scale).to({x: 1, y: 1}, 50, Phaser.Easing.Back.Out, true, 1000)
  }

  update () {

  }
}
