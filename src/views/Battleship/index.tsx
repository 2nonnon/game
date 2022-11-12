import { createContext, useContext, useState } from 'react'
import Modal from '../../components/Modal'

const BattleContext = createContext<InstanceType<typeof Ocean> | null>(null)

const NumToLetter = (num: number) => String.fromCharCode(64 + num)
// const LetterToNum = (letter: string) => letter.charCodeAt(0) - 64

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

type BaseStatus = 'visible' | 'hidden'

type ShipStatus = BaseStatus | 'sinked'

type ShipItemStatus = BaseStatus | 'hitted'

class Ship {
  public items: ShipItem[] = []

  constructor(public type: ShipEnum, public size: number, public positions: string[], public status: ShipStatus = 'hidden') {
    this.type = type
    this.size = size
    this.status = status
    this.positions = positions
    this.init()
  }

  init() {
    const status = this.status === 'sinked' ? 'hitted' : this.status
    this.items = this.positions.map(_ => new ShipItem(_, status),
    )
  }

  updateItemStatus(position: string, status: ShipItemStatus) {
    const item = this.items.find(_ => _.position === position)
    item?.update(status)
  }

  refreshStatus() {
    if (this.items.every(_ => _.status === 'hitted'))
      this.status = 'sinked'
  }

  updateStatus(status: ShipStatus) {
    this.status = status
    if (status === 'hidden' || status === 'visible') {
      this.items.forEach((_) => {
        if (_.status !== 'hitted')
          _.update(status)
      })
    }
    else {
      this.items.forEach((_) => {
        _.update('hitted')
      })
    }
  }
}

class ShipItem {
  constructor(public position: string, public status: ShipItemStatus) {
    this.position = position
    this.status = status
  }

  update(status: ShipItemStatus) {
    return this.status = status
  }
}

class Ocean {
  public status: number[][] = []
  public ships: Ship[] = []

  constructor(public size: number) {
    this.size = size
    this.init()
  }

  init() {
    const arr = Array.from({ length: this.size + 1 })
    this.status = arr.map(_ => arr.map(_ => 0))
  }

  generateShip(shipType: ShipEnum, status: ShipStatus = 'hidden') {
    const position = Math.random() > 0.5 ? 'x' : 'y'
    // const point1 = Math.floor(Math.random() * oceanSize) + 1
    // const point2 = Math.floor(Math.random() * (oceanSize - shipSize)) + 1
    const size = ShipTypes[shipType].size
    if (position === 'x') {
      const available = this.getHorizontalAvailable(size)
      const p = Math.floor(Math.random() * available.length)
      const [x, y] = available[p]
      const positions = Array.from({ length: size }).map((_, i) => {
        this.updateOcaenStatus([x, y + i])
        return `${NumToLetter(x)}-${y + i}`
      })
      const ship = new Ship(shipType, size, positions, status)
      this.ships.push(ship)
      return ship
    }
    else {
      const available = this.getVerticalAvailable(size)
      const p = Math.floor(Math.random() * available.length)
      const [x, y] = available[p]
      const positions = Array.from({ length: size }).map((_, i) => {
        this.updateOcaenStatus([x + i, y])
        return `${NumToLetter(x + i)}-${y}`
      })
      const ship = new Ship(shipType, size, positions, status)
      this.ships.push(ship)
      return ship
    }
  }

  updateOcaenStatus([x, y]: [number, number]) {
    this.status[x][y] = 1
  }

  getHorizontalAvailable(shipSize: number) {
    const result = [] as [number, number][]
    for (let x = 1; x <= this.size; x++) {
      for (let y = 1; y <= this.size; y++) {
        const p = this.status[x][y + shipSize]
        if (typeof p !== 'undefined' && p !== 1 && this.status[x][y] !== 1)
          result.push([x, y])

        else if (typeof p === 'undefined')
          break
      }
    }
    return result
  }

  getVerticalAvailable(shipSize: number) {
    const result = [] as [number, number][]
    for (let y = 1; y <= this.size; y++) {
      for (let x = 1; x <= this.size; x++) {
        const p = this.status[x + shipSize]?.[y]
        if (typeof p !== 'undefined' && p !== 1 && this.status[x][y] !== 1)
          result.push([x, y])

        else if (typeof p === 'undefined')
          break
      }
    }
    return result
  }

  blackSheepWall() {
    this.ships.forEach(_ => _.updateStatus('visible'))
  }
}

const Square = ({ className, children }: { className?: string; children?: any }) => {
  return <div className={`flex justify-center items-center h-6 w-6 border-t border-l border-gray-200 text-[16px] ${className}`}>{children}</div>
}

const Item = ({ className, position, setModal, setContent }: { className?: string; position: string; setModal: React.Dispatch<React.SetStateAction<boolean>>; setContent: React.Dispatch<React.SetStateAction<string>> }) => {
  const ocean = useContext(BattleContext)!
  const ship = ocean.ships.find(ship => ship.positions.includes(position))
  const shipItem = ship?.items.find(item => item.position === position)
  const statusInit = shipItem?.status ? shipItem.status : 'hidden'

  const [status, setStatus] = useState<BaseStatus | ShipItemStatus>(statusInit)

  const handleShotted = () => {
    if (status !== 'hidden')
      return
    let content = 'Miss.'
    if (shipItem) {
      setStatus(shipItem.update('hitted'))

      if (ship?.status === 'sinked')
        content = `Sink, ${ship.type}`
      else
        content = `Hit, ${ship?.type}`
    }
    else { setStatus('visible') }
    setContent(content)
    setModal(false)
  }
  const statusMap = {
    hitted: 'X',
    visible: shipItem ? '船' : 'O',
    hidden: '',
  }

  return <div className={`flex justify-center items-center h-6 w-6 border-t border-l border-gray-200 text-[16px] cursor-pointer ${className}`} onClick={handleShotted}>{statusMap[status]}</div>
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
    console.log(ocean.status)
    return ocean
  }
})()

const Battleship = () => {
  const ocean = initPlayer(10)

  const [modal, setModal] = useState(false)
  const [content, setContent] = useState('')
  const [count, setCount] = useState(0)

  return (<>
    {modal ? <Modal><Confirm content={content} setModal={setModal} /></Modal> : null}
    <BattleContext.Provider value={ocean}>
      <div className="flex justify-center items-center">
        <div onClick={() => {
          ocean.blackSheepWall()
          setCount(count + 1)
        }}>Black sheep wall{count}</div>
        <div className="grid grid-cols-11 w-fit select-none">
          {
            Array.from({ length: ocean.size + 1 }).map((_, row) => {
              return Array.from({ length: ocean.size + 1 }).map((_, col) => {
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
                  return <Item key={key} position={key} className={className} setModal={setModal} setContent={setContent}></Item>
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
