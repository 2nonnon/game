import { createContext, useContext, useState } from 'react'

const ShipContext = createContext([] as string[])

const NumToLetter = (num: number) => String.fromCharCode(64 + num)

const generateShip = (shipSize: number, oceanSize: number) => {
  const position = Math.random() > 0.5 ? 'x' : 'y'
  const point1 = Math.floor(Math.random() * oceanSize) + 1
  const point2 = Math.floor(Math.random() * (oceanSize - shipSize)) + 1
  if (position === 'x')
    return Array.from({ length: shipSize }).map((_, i) => `${NumToLetter(point1)}-${point2 + i + 1}`)
  else
    return Array.from({ length: shipSize }).map((_, i) => `${NumToLetter(point2 + i + 1)}-${point1}`)
}

const Square = ({ className, children }: { className?: string; children?: any }) => {
  return <div className={`flex justify-center items-center h-6 w-6 border-t border-l border-gray-200 text-[16px] ${className}`}>{children}</div>
}

const Item = ({ className, position }: { className?: string; position: string }) => {
  const [status, serStatus] = useState('')
  const ships = useContext(ShipContext)
  const handleShotted = () => {
    if (ships.includes(position))
      serStatus('X')
    else serStatus('O')
  }
  //   console.log(position)
  return <div className={`flex justify-center items-center h-6 w-6 border-t border-l border-gray-200 text-[16px] cursor-pointer ${className}`} onClick={handleShotted}>{status}</div>
}

const Battleship = () => {
  const ships = generateShip(3, 10)
  console.log(ships)
  return (<>
    <ShipContext.Provider value={ships}>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-11 w-fit select-none">
          {
            Array.from({ length: 11 }).map((_, row) => {
              return Array.from({ length: 11 }).map((_, col) => {
                if (!row && !col) { return <div key={`${row}-${col}`}></div> }
                else if (!row && col) { return <Square className={col === 11 - 1 ? 'border-r' : ''} key={`${row}-${col}`}>{col}</Square> }
                else if (row && !col) { return <Square className={row === 11 - 1 ? 'border-b' : ''} key={`${row}-${col}`}>{ NumToLetter(row) }</Square> }
                else {
                  const key = `${NumToLetter(row)}-${col}`
                  let className = ''
                  if (col === 1)
                    className += 'border-l-gray-700 border-l-2 '
                  if (row === 1)
                    className += 'border-t-gray-700 border-t-2 '
                  if (col === 11 - 1)
                    className += 'border-r-gray-700 border-r-2 '
                  if (row === 11 - 1)
                    className += 'border-b-gray-700 border-b-2 '
                  return <Item key={key} position={key} className={className}></Item>
                }
              })
            })
          }
        </div>
      </div>
    </ShipContext.Provider>
  </>)
}

export default Battleship
