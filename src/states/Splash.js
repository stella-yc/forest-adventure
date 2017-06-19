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
    this.load.image('sky', 'assets/images/back.png')
    this.load.image('ground', 'assets/images/platform.png')
    this.load.image('cherry', 'assets/images/cherry-7.png')
    this.load.image('bullet', 'assets/images/star.png')
    this.load.image('spikes', 'assets/images/spikes.png')
    this.load.image('gem', 'assets/images/gem.gif')
    this.load.image('groundTile', 'assets/images/groundTile.png')
    this.load.image('healthbarBorder', 'assets/images/healthbar.png')
    this.load.image('tree', 'assets/images/tree.png')
    this.load.image('hiddenPlatform', 'assets/images/hiddenPlatform.png')
    this.load.image('treeTop', 'assets/images/treeTop.png')
    this.load.image('treeTrunk', 'assets/images/treeTrunk.png')
    this.load.image('black', 'assets/images/black.png')

    this.load.spritesheet('player', 'assets/images/player-full.png', 32, 32)
    this.load.spritesheet('bot', 'assets/images/Old enemies 2 (1).png', 16, 16)
    this.load.spritesheet('blueBot', 'assets/images/blueBot.png', 16, 16)
    this.load.spritesheet('cat', 'assets/images/cat_fighter_sprite1.png', 50, 50)

  }

  create () {
    this.state.start('Game')
  }
}
