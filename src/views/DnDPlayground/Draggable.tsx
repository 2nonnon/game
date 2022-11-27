import { useDrag } from 'react-dnd'

interface DraggableProps {
  children?: any
  type: string
  item?: {
    [k: string]: any
  }
  style?: { [k: string]: string }
  text?: string
  hideWhenDrag?: boolean
  state?: any
}

function Draggable({ children, type, item, text, hideWhenDrag, state, style }: DraggableProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      item,
      collect: monitor => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [state],
  )

  if (isDragging && hideWhenDrag)
    return <div ref={drag}></div>

  return (
    <div
      style={style}
      ref={drag}
      className='border-2 py-1 px-3 rounded'
    >
      <span>{text}</span>
      {children}
    </div>
  )
}

export default Draggable
