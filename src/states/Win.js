import Phaser from 'phaser'

export default class Win extends Phaser.State {

  create () {
    this.game.stage.backgroundColor = '#4488AA'
    this.winTitle = new Phaser.Text(this.game, 0, 0, 'You Win!', {
      fill: 'white',
      align: 'center'
    })
    this.winTitle.anchor.setTo(0.5)
  }
}
