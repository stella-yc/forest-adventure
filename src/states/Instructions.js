import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}

  preload () {}

  create () {
    this.splashBackground()
    this.startWorld()
  }

  splashBackground () {
    this.game.stage.backgroundColor = '#fff'
    this.buildSky()
    this.buildForest()
    this.titleText()
    this.playButton()
  }

  titleText () {
    const text = 'Instructions: \n Left/Right arrow keys to move. \n Up arrow key to jump. \n Spacebar to shoot stars \n "C" to plant a tree.'
    const style = { font: '12px Cabin Sketch', fill: '#a9a9a9', align: 'center', backgroundColor: '#fff', padding: '1em' }
    this.game.add.text(70, 40, text, style)
  }

  buildSky () {
    const skyTile = this.game.add.tileSprite(0, 0, 288, 192, 'sky')
    skyTile.fixedToCamera = true
    return skyTile
  }

  buildForest () {
    const positions = [
      [-60, this.game.world.height - 100, 176, 368],
      [50, this.game.world.height - 70, 176, 368],
      [120, this.game.world.height - 100, 176, 368],
      [190, this.game.world.height - 100, 176, 368]
    ]
    positions.forEach(pos => this.game.add.tileSprite(...pos, 'forest'))
  }

  playButton () {
    const button = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 65, 'crate-button', this.startGame, this, 2, 1, 0)
    button.anchor.setTo(0.5)
    button.alpha = 0.9
    this.startText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 67, 'Play', { font: '15px Cabin Sketch', fill: '#47f3ff', align: 'center' })
    this.startText.anchor.setTo(0.5)
    return button
  }

  startGame () {
    this.state.start('Game')
  }

  startWorld () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.world.setBounds(0, 0, 3040, 192)
  }
}
