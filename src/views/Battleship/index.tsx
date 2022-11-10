import { createContext, useContext, useState } from 'react'

type Ship = { coordinate: string; status: boolean }[]

interface BattleInfo {
  ocean: InstanceType<typeof Ocean>
  ships: Ship[]
}

const BattleContext = createContext({} as BattleInfo)

const NumToLetter = (num: number) => String.fromCharCode(64 + num)

const generateShip = (shipSize: number, ocean: InstanceType<typeof Ocean>) => {
  const position = Math.random() > 0.5 ? 'x' : 'y'
  // const point1 = Math.floor(Math.random() * oceanSize) + 1
  // const point2 = Math.floor(Math.random() * (oceanSize - shipSize)) + 1
  if (position === 'x') {
    const available = ocean.getHorizontalAvailable(shipSize)
    const p = Math.floor(Math.random() * available.length)
    const [x, y] = available[p]
    return Array.from({ length: shipSize }).map((_, i) => ({
      coordinate: `${NumToLetter(x)}-${y + i + 1}`,
      status: false,
    }))
  }
  else {
    const available = ocean.getVerticalAvailable(shipSize)
    const p = Math.floor(Math.random() * available.length)
    const [x, y] = available[p]
    return Array.from({ length: shipSize }).map((_, i) => ({
      coordinate: `${NumToLetter(x + i + 1)}-${y}`,
      status: false,
    }))
  }
}

class Ocean {
  public status: number[][]

  constructor(public size: number) {
    this.size = size
    this.status = this.init()
  }

  init() {
    const arr = Array.from({ length: this.size + 1 })
    return arr.map(_ => arr.map(_ => 0))
  }

  update(ship: Ship) {
    ship.forEach((_) => {
      const [_x, _y] = _.coordinate.split('-')
      const x = _x.charCodeAt(0) - 64
      const y = +_y
      this.status[x][y] = 1
    })
    console.log(this.status)
  }

  getHorizontalAvailable(shipSize: number) {
    const result = [] as [number, number][]
    for (let x = 1; x <= this.size; x++) {
      for (let y = 1; y <= this.size; y++) {
        const p = this.status[x][y + shipSize]
        if (typeof p !== 'undefined' && p !== 1)
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
        if (typeof p !== 'undefined' && p !== 1)
          result.push([x, y])

        else if (typeof p === 'undefined')
          break
      }
    }
    return result
  }
}

const Square = ({ className, children }: { className?: string; children?: any }) => {
  return <div className={`flex justify-center items-center h-6 w-6 border-t border-l border-gray-200 text-[16px] ${className}`}>{children}</div>
}

const Item = ({ className, position }: { className?: string; position: string }) => {
  const [status, serStatus] = useState('')
  const { ships } = useContext(BattleContext)
  const handleShotted = () => {
    if (ships.some(ship => ship.some(_ => _.coordinate === position)))
      serStatus('X')
    else serStatus('O')
  }
  //   console.log(position)
  return <div className={`flex justify-center items-center h-6 w-6 border-t border-l border-gray-200 text-[16px] cursor-pointer ${className}`} onClick={handleShotted}>{status}</div>
}

const Battleship = () => {
  const ocean = new Ocean(10)
  const CRUISER = generateShip(3, ocean)
  console.log(CRUISER)
  ocean.update(CRUISER)
  const CARRIER = generateShip(5, ocean)
  console.log(CARRIER)
  ocean.update(CARRIER)
  const SUBMARINE = generateShip(3, ocean)
  console.log(SUBMARINE)
  ocean.update(SUBMARINE)
  const BATTLESHIP = generateShip(4, ocean)
  console.log(BATTLESHIP)
  ocean.update(BATTLESHIP)
  const DESTROYER = generateShip(2, ocean)
  console.log(DESTROYER)
  ocean.update(DESTROYER)
  const battleInfo = {
    ocean,
    ships: [CRUISER, CARRIER, SUBMARINE, BATTLESHIP, DESTROYER],
  }
  return (<>
    <BattleContext.Provider value={battleInfo}>
      <div className="flex justify-center items-center">
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
                  return <Item key={key} position={key} className={className}></Item>
                }
              })
            })
          }
        </div>
      </div>
    </BattleContext.Provider>
  </>)
}

export default Battleship
