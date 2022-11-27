export type Coordinate = [x: number, y: number]

export const ItemTypes = {
  KNIGHT: 'knight',
}

type Observer = (knightPosition: Coordinate) => void

let knightPosition: Coordinate = [0, 0]
let observer: null | Observer = null

function emitChange() {
  observer!(knightPosition)
}

export function observe(o: Observer) {
//   if (!observer)
  observer = o

//   emitChange()
}

export function moveKnight(toX: number, toY: number) {
  knightPosition = [toX, toY]
  emitChange()
}

export function canMoveKnight(toX: number, toY: number) {
  const [x, y] = knightPosition
  const dx = toX - x
  const dy = toY - y

  return (
    (Math.abs(dx) === 2 && Math.abs(dy) === 1)
      || (Math.abs(dx) === 1 && Math.abs(dy) === 2)
  )
}
