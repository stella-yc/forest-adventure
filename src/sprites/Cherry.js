// So I want to modularize this so that there is a separate
// file for the group "cherries"
// new Group(game, parent, name, addToStage, enableBody, physicsBodyType)

import Phaser from 'phaser'
export default class Cherry extends Phaser.Sprite {

  constructor ({ game, x, y, key, frame }) {
    super(game, x, y, key, frame)

    this.anchor.setTo(0.5, 1)
    this.body.gravity.y = 300
    this.body.bounce.y = 0.2
  }

  update () {

  }
}
