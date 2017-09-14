import Phaser from 'phaser'
import { imgTable, spriteTable } from '../imgTable'
import { centerGameObjects, loadImages, loadSprites } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    // this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    // this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    // centerGameObjects([this.loaderBg, this.loaderBar])
    // this.load.setPreloadSprite(this.loaderBar)

    // Load assets
    loadImages(imgTable, this)
    loadSprites(spriteTable, this)
  }

  create () {
    this.splashBackground()
    this.startButton()
  }

  startGame () {
    this.state.start('Game')
  }

  splashBackground () {
    this.game.stage.backgroundColor = '#b4de5b'
    const skyTile = this.game.add.tileSprite(0, 0, 288, 192, 'sky')
    skyTile.fixedToCamera = true
    this.buildForest()
    this.titleText = this.game.add.text(70, 40, 'Forest Adventure', { font: '20px Cabin Sketch', fill: '#ffffff', align: 'center' })
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

  startButton () {
    const button = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 40, 'crate-button', this.startGame, this, 2, 1, 0)
    button.anchor.setTo(0.5)
    button.alpha = 0.9
    this.startText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 42, 'Start', { font: '15px Cabin Sketch', fill: '#47f3ff', align: 'center' })
    this.startText.anchor.setTo(0.5)
    return button
  }
}
