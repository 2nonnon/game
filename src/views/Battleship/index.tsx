import { createContext, useContext, useState } from 'react'
import Modal from '../../components/Modal'

const BattleContext = createContext<InstanceType<typeof Ocean> | null>(null)

const NumToLetter = (num: number) => String.fromCharCode(64 + num)
const LetterToNum = (letter: string) => letter.charCodeAt(0) - 64

enum ShipEnum {
  CARRIER = 'Carrier',
  BATTLESHIP = 'Battleship',
  CRUISER = 'Cruiser',
  SUBMARINE = 'Submarine',
  DESTROYER = 'Destroyer',
}

const ShipTypes = {
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

type Coordinate = [number, number]

type BaseStatus = 'Visible' | 'Hidden'

type ShipStatus = BaseStatus | 'Sink'

type ShipItemStatus = ShipStatus | 'Hit'

class Ship {
  constructor(public type: ShipEnum, public size: number, public items: InstanceType<typeof ShipItem>[], public status: ShipStatus = 'Hidden', public positions: string[] = []) {
    this.type = type
    this.size = size
    this.status = status
    this.positions = positions
    if (positions.length > 0) { this.init(positions) }
    else {
      this.items = items.map((item) => {
        this.positions.push(item.position)
        item.ship = this
        return item
      })
    }
  }

  init(positions: string[]) {
    const status = this.status === 'Sink' ? 'Hit' : this.status
    this.items = positions.map((_) => {
      const item = new ShipItem(_, status)
      item.ship = this
      return item
    })
  }

  updateItemStatus(position: string, status: ShipItemStatus) {
    const item = this.items.find(_ => _.position === position)
    item?.update(status)
  }

  refreshStatus() {
    if (this.items.every(_ => _.status === 'Hit'))
      this.updateStatus('Sink')
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

class ShipItem {
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

class OceanItem {
  constructor(public position: string, public status: OceanItemStatus = 'Hidden') {
    this.position = position
    this.status = status
  }

  handleShotted() {
    this.status = 'Miss'
    return 'Miss.'
  }
}

type OceanItemStatus = 'Miss' | 'Hidden'

type GridItem = InstanceType<typeof OceanItem> | InstanceType<typeof ShipItem>

class Ocean {
  public items: GridItem[][] = []
  public ships: Ship[] = []

  constructor(public size: number) {
    this.size = size
    this.init()
  }

  init() {
    const arr = Array.from({ length: this.size + 1 })
    this.items = arr.map((_, x) => arr.map((_, y) => new OceanItem(`${NumToLetter(x)}-${y}`)))
  }

  updateOcaenStatus([x, y]: Coordinate, item: GridItem) {
    this.items[x][y] = item
  }

  generateShip(shipType: ShipEnum, status: ShipStatus = 'Hidden') {
    const direction = Math.random() > 0.5 ? 'x' : 'y'
    const size = ShipTypes[shipType].size

    const available = direction === 'x' ? this.getHorizontalAvailable(size) : this.getVerticalAvailable(size)
    const start = available[Math.floor(Math.random() * available.length)]
    return this.setShip(shipType, start, direction, status)
  }

  setShip(shipType: ShipEnum, start: Coordinate, direction: 'x' | 'y', status: ShipStatus = 'Hidden') {
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
    const ship = new Ship(shipType, shipSize, shipItems, status)
    this.ships.push(ship)
    return ship
  }

  getHorizontalAvailable(shipSize: number) {
    const result = [] as Coordinate[]
    for (let x = 1; x <= this.size; x++) {
      for (let y = 1; y <= this.size; y++) {
        if (y + shipSize - 1 > this.size)
          break

        const road = Array.from({ length: shipSize }).map((_, i) => `${NumToLetter(x)}-${y + i}`)

        if (!this.ships.some(ship => ship.positions.some(p => road.includes(p))))
          result.push([x, y])
      }
    }
    return result
  }

  getVerticalAvailable(shipSize: number) {
    const result = [] as Coordinate[]
    for (let y = 1; y <= this.size; y++) {
      for (let x = 1; x <= this.size; x++) {
        if (x + shipSize - 1 > this.size)
          break

        const road = Array.from({ length: shipSize }).map((_, i) => `${NumToLetter(x + i)}-${y}`)

        if (!this.ships.some(ship => ship.positions.some(p => road.includes(p))))
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

const Square = ({ className, children }: { className?: string; children?: any }) => {
  return <div className={`flex justify-center items-center h-6 w-6 border-t border-l border-gray-200 text-[16px] ${className}`}>{children}</div>
}

const Item = ({ item, className, position, setItems, setContent, setModal }: {
  className?: string
  item: GridItem
  position: string
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  setContent: React.Dispatch<React.SetStateAction<string>>
  setItems: React.Dispatch<React.SetStateAction<GridItem[][]>>
}) => {
  const ocean = useContext(BattleContext)!

  const handleShotted = () => {
    if (item.status !== 'Hidden')
      return

    const result = ocean.handleShotted(position)
    console.log(item.status)
    setItems([...ocean.items])
    setContent(result)
    setModal(true)
  }
  const statusMap = {
    Hit: 'H',
    Visible: '船',
    Hidden: '',
    Miss: 'M',
    Sink: 'S',
  }

  return <div className={`flex justify-center items-center h-6 w-6 border-t border-l border-gray-200 text-[16px] cursor-pointer ${className}`} onClick={handleShotted}>{statusMap[item.status]}</div>
}

const initPlayer = (() => {
  let ocean: InstanceType<typeof Ocean> | undefined

  return (size: number) => {
    if (ocean)
      return ocean
    ocean = new Ocean(size)
    ocean.generateShip(ShipEnum.BATTLESHIP)
    ocean.generateShip(ShipEnum.CARRIER)
    ocean.generateShip(ShipEnum.CRUISER)
    ocean.generateShip(ShipEnum.DESTROYER)
    ocean.generateShip(ShipEnum.SUBMARINE)
    console.log(ocean.items)
    return ocean
  }
})()

const Battleship = () => {
  const ocean = initPlayer(10)
  const [items, setItems] = useState(ocean.items)

  const [modal, setModal] = useState(false)
  const [content, setContent] = useState('')
  return (<>
    {modal ? <Modal><Confirm content={content} setModal={setModal} /></Modal> : null}
    <BattleContext.Provider value={ocean}>
      <div className="flex justify-center items-center">
        <div onClick={() => {
          ocean.blackSheepWall()
          setItems([...ocean.items])
        }}>Black sheep wall</div>
        <div className="grid grid-cols-11 w-fit select-none">
          {
            items.map((_, row) => {
              return _.map((_, col) => {
                if (!row && !col) { return <div key={`${row}-${col}`}></div> }
                else if (!row && col) { return <Square className={col === ocean.size ? 'border-r' : ''} key={`${row}-${col}`}>{col}</Square> }
                else if (row && !col) { return <Square className={row === ocean.size ? 'border-b' : ''} key={`${row}-${col}`}>{ NumToLetter(row) }</Square> }
                else {
                  const key = `${NumToLetter(row)}-${col}`
                  let className = ''
                  if (col === 1)
                    className += 'border-l-gray-700 border-l-2 '
                  if (row === 1)
                    className += 'border-t-gray-700 border-t-2 '
                  if (col === ocean.size)
                    className += 'border-r-gray-700 border-r-2 '
                  if (row === ocean.size)
                    className += 'border-b-gray-700 border-b-2 '
                  return <Item item={_} key={key} position={key} className={className} setModal={setModal} setContent={setContent} setItems={setItems}></Item>
                }
              })
            })
          }
        </div>
      </div>
    </BattleContext.Provider>
  </>)
}

function Confirm({ content, setModal }: { content: string; setModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <div className='p-4 bg-white shadow-md rounded-xl text-sm w-[300px] min-h-[120px] flex flex-col justify-between gap-2'>
      <div>{content}</div>
      <div className='flex justify-end items-center'>
        <button className='border rounded-md p-1' onClick={(event) => {
          event.preventDefault()
          setModal(false)
        }}>Confirm</button>
      </div>
    </div>
  )
}

export default Battleship
