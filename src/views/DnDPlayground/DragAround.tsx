import { useState } from 'react'
import Draggable from './Draggable'
import Droppable from './Droppable'

function DragAround() {
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const handleDrop = (item: { text: string }, monitor: any, state: { top: number; left: number }) => {
    const { x, y } = monitor.getDifferenceFromInitialOffset()
    const { top, left } = { top: state.top + y, left: state.left + x }
    console.log({ x, y })
    // if (top > 0 && left > 0)
    setPosition(() => ({ top, left }))
  }

  const dragStyle = {
    position: 'relative',
    justifyContent: 'left',
    left: `${position.left}px`,
    top: `${position.top}px`,
  }

  return (
    <>
      <Droppable
        accept='drag-4'
        handleDrop={handleDrop}
        state={position}
        className='h-full'
      >
        <Draggable
          type='drag-4'
          style={dragStyle}
          text='Drag Me!'
          hideWhenDrag={true}
          item={{ top: position.top, left: position.left }}
          state={position}
        />
      </Droppable>
    </>
  )
}

export default DragAround
