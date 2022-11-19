import { useState } from 'react'
import { DndProvider, DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import img from '../../assets/react.svg'
import type { Coordinate } from './Game'
import { ItemTypes, canMoveKnight, moveKnight, observe } from './Game'

const Knight = () => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.KNIGHT,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const knightImage = img

  return (
    <>
      <DragPreviewImage connect={preview} src={knightImage} />
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          fontSize: 25,
          fontWeight: 'bold',
          cursor: 'move',
        }}
      >
      ♘
      </div>
    </>
  )
}

const Square = ({ black, children }: { black: boolean; children: any }) => {
  const fill = black ? 'black' : 'white'
  const stroke = black ? 'white' : 'black'
  return <div style={{
    backgroundColor: fill,
    color: stroke,
    width: '100%',
    height: '100%',
  }}>{children}</div>
}

const Overlay = ({ color }: { color: string }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 1,
        opacity: 0.5,
        backgroundColor: color,
      }}
      className='pointer-events-none'
    />
  )
}

const BoardSquare = ({ x, y, children }: { x: number; y: number; children: any }) => {
  const black = (x + y) % 2 === 1
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.KNIGHT,
    canDrop: () => canMoveKnight(x, y),
    drop: () => moveKnight(x, y),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [x, y])

  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <Square black={black}>{children}</Square>
      {isOver && !canDrop && <Overlay color="red" />}
      {!isOver && canDrop && <Overlay color="yellow" />}
      {isOver && canDrop && <Overlay color="green" />}
    </div>
  )
}

function handleSquareClick(toX: number, toY: number) {
  if (canMoveKnight(toX, toY))
    moveKnight(toX, toY)
}

const renderPiece = (x: number, y: number, [knightX, knightY]: Coordinate) => {
  if (x === knightX && y === knightY)
    return <Knight />
}

const renderSquare = (i: number, knightPosition: Coordinate) => {
  const x = i % 8
  const y = Math.floor(i / 8)

  return (
    <div key={i} style={{ width: '12.5%', height: '12.5%' }} onClick={() => handleSquareClick(x, y)}>
      <BoardSquare x={x} y={y}>
        <div className="flex justify-center items-center h-full">
          {renderPiece(x, y, knightPosition)}
        </div>
      </BoardSquare>
    </div>
  )
}

const Board = ({ knightPosition }: { knightPosition: Coordinate }) => {
  const squares = []
  for (let i = 0; i < 64; i++)
    squares.push(renderSquare(i, knightPosition))

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {squares}
      </div>
    </DndProvider>

  )
}

const DnDPalyground = () => {
  const [knightPosition, setKnightPosition] = useState<Coordinate>([0, 0])
  observe((_knightPosition: Coordinate) => {
    setKnightPosition(() => _knightPosition)
  })

  return <>
    <div className="flex justify-center items-center h-screen">
      <Board knightPosition={knightPosition}></Board>
    </div>
  </>
}

export default DnDPalyground
