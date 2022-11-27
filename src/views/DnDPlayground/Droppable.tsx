import { useDrop } from 'react-dnd'

interface DroppableProps {
  children?: any
  text?: string
  state?: any
  accept: string | string[]
  className?: string
  handleDrop: (...args: any[]) => any
}

function Droppable({ accept, handleDrop, text, children, state, className }: DroppableProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept,
      drop: (item, monitor) => handleDrop(item, monitor, state),
      collect: monitor => ({
        isOver: !!monitor.isOver({ shallow: true }),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [state], // Dependency
  )

  //   const isActive = isOver && canDrop
  //   console.log(isActive)

  return (
    <div
      className={`flex-1 rounded-md border-2 flex justify-center items-center ${className ?? ''}`}
      ref={drop}
    >
      {text ? <div>{text}</div> : null}
      {children}
    </div>
  )
}

export default Droppable
