import { createContext, useContext, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Modal from '../../components/Modal'
import { NumToLetter } from './helper'
import type { OceanGridItem, OceanIns } from './ocean'
import Ocean, { ShipEnum, ShipTypes } from './ocean'

const OceanContext = createContext<OceanIns | null>(null)

const BattleContext = createContext<{
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  setContent: React.Dispatch<React.SetStateAction<string>>
} | null>(null)

const Coordinate = ({ className, children }: { className?: string; children?: any }) => {
  return <div className={`flex justify-center items-center h-6 w-6 border-t border-l border-gray-200 text-[16px] ${className}`}>{children}</div>
}

const Item = ({ item, className, position, setItems }: {
  className?: string
  item: OceanGridItem
  position: string
  setItems: React.Dispatch<React.SetStateAction<OceanGridItem[][]>>
}) => {
  const ocean = useContext(OceanContext)!
  const {
    setContent,
    setModal,
  } = useContext(BattleContext)!

  const handleShotted = () => {
    if (item.status !== 'Hidden')
      return

    const result = ocean.handleShotted(position)

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
  let ocean: OceanIns | undefined

  return (size: number) => {
    if (ocean)
      return ocean
    ocean = new Ocean(size)

    return ocean
  }
})()

const initComputer = (() => {
  let ocean: OceanIns | undefined

  return (size: number) => {
    if (ocean)
      return ocean
    ocean = new Ocean(size)
    ocean.generateShip(ShipEnum.BATTLESHIP)
    ocean.generateShip(ShipEnum.CARRIER)
    ocean.generateShip(ShipEnum.CRUISER)
    ocean.generateShip(ShipEnum.DESTROYER)
    ocean.generateShip(ShipEnum.SUBMARINE)

    return ocean
  }
})()

const OceanGrid = ({ ocean }: { ocean: OceanIns }) => {
  const [items, setItems] = useState(ocean.items)
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'ship',
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }))

  console.log(isOver, canDrop)

  return (
    <OceanContext.Provider value={ocean}>
      <div className="flex justify-center items-center">
        {/* <div onClick={() => {
        ocean.blackSheepWall()
        setItems([...ocean.items])
      }}>Black sheep wall</div> */}
        <div ref={drop} className="grid grid-cols-11 w-fit select-none">
          {
            items.map((_, row) => {
              return _.map((_, col) => {
                if (!row && !col) { return <div key={`${row}-${col}`}></div> }
                else if (!row && col) { return <Coordinate className={col === ocean.size ? 'border-r' : ''} key={`${row}-${col}`}>{col}</Coordinate> }
                else if (row && !col) { return <Coordinate className={row === ocean.size ? 'border-b' : ''} key={`${row}-${col}`}>{ NumToLetter(row) }</Coordinate> }
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
                  return <Item item={_} key={key} position={key} className={className} setItems={setItems}></Item>
                }
              })
            })
          }
        </div>
      </div>
    </OceanContext.Provider>
  )
}

const DragShip = ({ size }: { size: number }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ship',
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))
  return (
    <div className={`w-fit flex${isDragging ? 'opacity-50' : ''}`} ref={drag}>
      {Array.from({ length: size }).map((_, i) => <div key={i} className='border w-[30px] h-[30px]'></div>)}
    </div>
  )
}

const Battleship = () => {
  const [modal, setModal] = useState(false)
  const [content, setContent] = useState('')
  const playerOcean = initPlayer(10)
  const computerOcean = initComputer(10)

  return (<>
    {modal ? <Modal><Confirm content={content} setModal={setModal} /></Modal> : null}
    <DndProvider backend={HTML5Backend}>
      <BattleContext.Provider value={{
        setModal,
        setContent,
      }}>
        <div className='h-screen flex justify-center items-center'>
          <div className='w-full'>
            <div className='flex'>
              <div className='flex-1'>
                {Object.keys(ShipTypes).map(type => <DragShip key={type} size={ShipTypes[type as ShipEnum].size}></DragShip>)}
              </div>
              <div className='flex-1'><OceanGrid ocean={playerOcean}></OceanGrid></div>
            </div>
            <div><OceanGrid ocean={computerOcean}></OceanGrid></div>
          </div>
        </div>
      </BattleContext.Provider>
    </DndProvider>
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
