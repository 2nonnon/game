import Draggable from './Draggable'
import DragGroup from './DragGroup'
import Droppable from './Droppable'

function MutipleTarget() {
  const handleShort = (item: { name: string }) => {
    // eslint-disable-next-line no-alert
    alert(`${item.name} is Shorthair!`)
  }

  const handleLong = (item: { name: string }) => {
    // eslint-disable-next-line no-alert
    alert(`${item.name} is Longhair!`)
  }

  return (
    <>
      <div className='flex flex-col gap-6 h-full'>
        <DragGroup>
          <Draggable
            type='drag2-bs'
            text='British Shorthair'
            item={{ name: 'British Shorthair' }}
          />
          <Draggable
            type='drag2-bl'
            text='British Longhair'
            item={{ name: 'British Longhair' }}
          />
          <Draggable
            type='drag2-as'
            text='American Shorthair'
            item={{ name: 'American Shorthair' }}
          />
          <Draggable
            type='drag2-al'
            text='American Longhair'
            item={{ name: 'American Longhair' }}
          />
        </DragGroup>
        <Droppable
          accept={['drag2-bs', 'drag2-as']}
          handleDrop={handleShort}
          text='Shorthair'
        />
        <Droppable
          accept={['drag2-bl', 'drag2-al']}
          handleDrop={handleLong}
          text='Longhair'
        />
      </div>
    </>
  )
}

export default MutipleTarget
