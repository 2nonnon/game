import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

interface CardProps {
  index: number
  id?: number
  text: string
  handleDrag: (...args: any[]) => any
  state: any
}

function Card({ index, id, text, handleDrag, state }: CardProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { id, index },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const [{ handlerId }, drop] = useDrop(
    () => ({
      accept: 'card',
      collect: monitor => ({
        handlerId: monitor.getHandlerId(),
      }),
      hover: (item, monitor) => {
        if (!ref.current)
          return
        const dragIndex = (item as any).index
        const hoverIndex = index
        // Do nothing if target and source are same
        if (dragIndex === hoverIndex)
          return

        const hoverRect = ref.current.getBoundingClientRect()
        // Get vertical middle
        const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2
        // Determine mouse position
        const clientOffset = monitor.getClientOffset()
        // Get pixels to the top
        const hoverClientY = clientOffset!.y - hoverRect.top

        console.log(hoverRect, hoverMiddleY, clientOffset, hoverClientY)

        // Only move when the mouse has crossed half of the items height
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY)
          return

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
          return

        handleDrag(dragIndex, hoverIndex);

        (item as any).index = hoverIndex
      },
    }),
    [state],
  )

  const opacity = isDragging ? 0 : 1

  drag(drop(ref))
  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className='border-2 rounded min-w-[150px] text-center px-3 py-1'
    >
      {text}
    </div>
  )
}

export default Card
