import Phaser from 'phaser'

export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const loadImages = (imgTable, context) => {
  Object.keys(imgTable).forEach(name =>
    context.load.image(name, imgTable[name])
  )
}

export const loadSprites = (spriteTable, context) => {
  Object.keys(spriteTable).forEach(name =>
    context.load.spritesheet(name, ...spriteTable[name])
  )
}

export const loadTileMapsJSON = (tileTable, context) => {
  Object.keys(tileTable).forEach(name =>
    context.game.load.tilemap(name, tileTable[name], null, Phaser.Tilemap.TILED_JSON)
  )
}
