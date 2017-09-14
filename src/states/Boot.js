import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Cabin Sketch']
      },
      active: this.fontsLoaded
    })

    let text = this.add.text(this.world.centerX, this.world.centerY, 'Loading...', { font: '20px Cabin Sketch', fill: '#b4de5b', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    // can load images here
    // this.load.image('loaderBg', './assets/images/loader-bg.png')
    // this.load.image('loaderBar', './assets/images/loader-bar.png')
  }

  create () {
    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.renderer.renderSession.roundPixels = true // no blurring
  }
  render () {
    this.game.stage.backgroundColor = '#fff'
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
