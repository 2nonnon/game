import Draggable from './Draggable'
import DragGroup from './DragGroup'
import Droppable from './Droppable'

function SingleTarget() {
  const handleDrop = (item: { name: string }) => {
    // eslint-disable-next-line no-alert
    alert(`You drop ${item.name}!`)
  }

  return (
    <>
      <div className='flex flex-col gap-6 h-full'>
        <DragGroup>
          <Draggable type='drag1' text='React' item={{ name: 'React' }} />
          <Draggable type='drag1' text='Vue' item={{ name: 'Vue' }} />
          <Draggable type='drag1' text='Angular' item={{ name: 'Angular' }} />
        </DragGroup>
        <Droppable accept='drag1' handleDrop={handleDrop} text='Drop it Here!' />
      </div>
    </>
  )
}

export default SingleTarget
