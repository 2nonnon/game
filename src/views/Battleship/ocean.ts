import { LetterToNum, NumToLetter } from './helper'

export enum ShipEnum {
  CARRIER = 'Carrier',
  BATTLESHIP = 'Battleship',
  CRUISER = 'Cruiser',
  SUBMARINE = 'Submarine',
  DESTROYER = 'Destroyer',
}

export const ShipTypes = {
  [ShipEnum.CARRIER]: {
    size: 5,
  },
  [ShipEnum.BATTLESHIP]: {
    size: 4,
  },
  [ShipEnum.CRUISER]: {
    size: 3,
  },
  [ShipEnum.SUBMARINE]: {
    size: 3,
  },
  [ShipEnum.DESTROYER]: {
    size: 2,
  },
}

export type Point = [number, number]

export type BaseStatus = 'Visible' | 'Hidden'

export type ShipStatus = BaseStatus | 'Sink'

class Ship {
  constructor(public type: ShipEnum, public items: InstanceType<typeof ShipItem>[], public status: ShipStatus = 'Hidden') {
    this.type = type
    this.status = status
    this.items = items.map((item) => {
      item.ship = this
      return item
    })
  }

  refreshStatus() {
    if (this.items.every(_ => _.status === 'Hit'))
      this.updateStatus('Sink')
    return this.status
  }

  updateStatus(status: ShipStatus) {
    this.status = status
    if (status === 'Hidden' || status === 'Visible') {
      this.items.forEach((_) => {
        if (_.status !== 'Hit' && _.status !== 'Sink')
          _.update(status)
      })
    }
    else {
      this.items.forEach((_) => {
        _.update('Sink')
      })
    }
  }
}

abstract class GridItem<T = any> {
  constructor(public position: string, public status: T) {}

  abstract handleShotted(): string
}

export type ShipItemStatus = ShipStatus | 'Hit'

class ShipItem implements GridItem<ShipItemStatus> {
  ship: InstanceType<typeof Ship> | null = null

  constructor(public position: string, public status: ShipItemStatus) {
    this.position = position
    this.status = status
  }

  update(status: ShipItemStatus) {
    return this.status = status
  }

  handleShotted() {
    this.status = 'Hit'
    this.ship?.refreshStatus()
    return `${this.status}, ${this.ship?.type}`
  }
}

export type OceanItemStatus = 'Miss' | 'Hidden'

class OceanItem implements GridItem<OceanItemStatus> {
  constructor(public position: string, public status: OceanItemStatus = 'Hidden') {
    this.position = position
    this.status = status
  }

  handleShotted() {
    this.status = 'Miss'
    return 'Miss.'
  }
}

export type OceanGridItem = GridItem<ShipItemStatus | OceanItemStatus>

class Ocean {
  public items: OceanGridItem[][] = []
  public ships: Ship[] = []

  constructor(public size: number) {
    this.size = size
    this.init()
  }

  init() {
    const arr = Array.from({ length: this.size + 1 })
    this.items = arr.map((_, x) => arr.map((_, y) => new OceanItem(`${NumToLetter(x)}-${y}`)))
  }

  updateOcaenStatus([x, y]: Point, item: OceanGridItem) {
    this.items[x][y] = item
  }

  generateShip(shipType: ShipEnum, status: ShipStatus = 'Hidden') {
    const direction = Math.random() > 0.5 ? 'x' : 'y'
    const size = ShipTypes[shipType].size

    const available = direction === 'x' ? this.getHorizontalAvailable(size) : this.getVerticalAvailable(size)
    const start = available[Math.floor(Math.random() * available.length)]
    return this.setShip(shipType, start, direction, status)
  }

  setShip(shipType: ShipEnum, start: Point, direction: 'x' | 'y', status: ShipStatus = 'Hidden') {
    const shipSize = ShipTypes[shipType].size
    const [x, y] = start
    const shipItems = direction === 'x'
      ? Array.from({ length: shipSize }).map((_, i) => {
        const shipItem = new ShipItem(`${NumToLetter(x)}-${y + i}`, 'Hidden')
        this.updateOcaenStatus([x, y + i], shipItem)
        return shipItem
      })
      : Array.from({ length: shipSize }).map((_, i) => {
        const shipItem = new ShipItem(`${NumToLetter(x + i)}-${y}`, 'Hidden')
        this.updateOcaenStatus([x + i, y], shipItem)
        return shipItem
      })
    const ship = new Ship(shipType, shipItems, status)
    this.ships.push(ship)
    return ship
  }

  getHorizontalAvailable(shipSize: number) {
    const result = [] as Point[]
    for (let x = 1; x <= this.size; x++) {
      for (let y = 1; y <= this.size; y++) {
        if (y + shipSize - 1 > this.size)
          break

        const road = Array.from({ length: shipSize }).map((_, i) => `${NumToLetter(x)}-${y + i}`)

        if (!this.ships.some(ship => ship.items.some(item => road.includes(item.position))))
          result.push([x, y])
      }
    }
    return result
  }

  getVerticalAvailable(shipSize: number) {
    const result = [] as Point[]
    for (let y = 1; y <= this.size; y++) {
      for (let x = 1; x <= this.size; x++) {
        if (x + shipSize - 1 > this.size)
          break

        const road = Array.from({ length: shipSize }).map((_, i) => `${NumToLetter(x + i)}-${y}`)

        if (!this.ships.some(ship => ship.items.some(item => road.includes(item.position))))
          result.push([x, y])
      }
    }
    return result
  }

  blackSheepWall() {
    this.ships.forEach(_ => _.updateStatus('Visible'))
  }

  handleShotted(position: string) {
    const [x, y] = position.split('-')
    return this.items[LetterToNum(x)][+y].handleShotted()
  }
}

export type OceanIns = InstanceType<typeof Ocean>

export default Ocean
