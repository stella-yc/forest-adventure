import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.spritesheet('player', 'assets/images/payer-run.png', 32, 32)
    this.load.image('sky', 'assets/images/back.png')
    this.load.image('ground', 'assets/images/platform.png')
    this.load.image('cherry', 'assets/images/cherry-7.png')
  }

  create () {
    this.state.start('Game')
  }
}
