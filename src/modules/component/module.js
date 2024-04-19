import { modules } from './modules.js'

export const newModule = (proto, isGhost, position, rotation) => {
  let { category, name, boundingRect, tiles } = proto
  return {
    module: {
      isGhost,
      category,
      name,
      boundingRect: rotate(boundingRect, rotation, boundingRect),
      tiles: Object.fromEntries(
	Object.entries(tiles)
	.map(([key, rects]) => 
	  [
	    key,
	    rects.map(
	      rect => rotate(rect, rotation, boundingRect))
	  ])),
    },
    position
  }
}

function rotate(rect, rotation, boundingRect) {
  // Ascending rotation is clockwise
  switch(rotation) {
    case 0:
      return rect
    case 1:
      return {
	offsetX: boundingRect.height - rect.height - rect.offsetY,
	offsetY: rect.offsetX,
	width: rect.height,
	height: rect.width
      }
    case 2:
      return {
	offsetX: boundingRect.width - rect.width - rect.offsetX,
	offsetY: boundingRect.height - rect.height - rect.offsetY,
	width: rect.width,
	height: rect.height
      }
    case 3:
      return {
	offsetX: rect.offsetY,
	offsetY: boundingRect.width - rect.width - rect.offsetX,
	width: rect.height,
	height: rect.width
      }
    default:
      throw new Error(`Unexpected rotation ${rotation}`)
  }
}
