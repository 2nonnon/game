import { useState } from 'react'
import Draggable from './Draggable'
import DragGroup from './DragGroup'
import Droppable from './Droppable'

function RealDrop() {
  const [box1, setBox1] = useState([
    { text: 'Hello' },
    { text: 'World' },
  ])
  const [box2, setBox2] = useState<{ text: string }[]>([])

  const handleBox1 = (item: { text: string }, monitor: unknown, state: { text: string }[]) => {
    if (state.find(each => each.text === item.text))
      return
    // remove from box2
    setBox2((prev) => {
      const index = prev.findIndex(each => each.text === item.text)
      const copy = [...prev]
      copy.splice(index, 1)
      return copy
    })
    // add to box1
    setBox1((prev) => {
      return [...prev, { text: item.text }]
    })
  }

  const handleBox2 = (item: { text: string }, monitor: unknown, state: { text: string }[]) => {
    if (state.find(each => each.text === item.text))
      return
    // remove from box1
    setBox1((prev) => {
      const index = prev.findIndex(each => each.text === item.text)
      const copy = [...prev]
      copy.splice(index, 1)
      return copy
    })
    // add to box2
    setBox2((prev) => {
      return [...prev, { text: item.text }]
    })
  }

  return (
    <>
      <div className='flex flex-col gap-6 h-full'>
        <Droppable
          accept='drag-3'
          handleDrop={handleBox1}
          text='Box1'
          state={box1}
          className='flex-1 flex gap-6 p-4'
        >
          <DragGroup className='flex-1 h-full'>
            {box1.map(drag => (
              <Draggable
                key={drag.text}
                type='drag-3'
                text={drag.text}
                item={{ text: drag.text }}
                state={box1}
              />
            ))}
          </DragGroup>
        </Droppable>
        <Droppable
          accept='drag-3'
          handleDrop={handleBox2}
          text='Box 2'
          state={box2}
          className='flex-1 flex gap-6 p-4'
        >
          <DragGroup className='flex-1 h-full'>
            {box2.map(drag => (
              <Draggable
                key={drag.text}
                type='drag-3'
                text={drag.text}
                item={{ text: drag.text }}
                state={box2}
              />
            ))}
          </DragGroup>
        </Droppable>
      </div>
    </>
  )
}

export default RealDrop
