import Draggable from './Draggable'
import Droppable from './Droppable'

function Eg5() {
  const handleDrop = (item: { name: string }, _monitor: unknown, _state: any) => {
    // eslint-disable-next-line no-alert
    alert(`You drop ${item.name}!`)
  }
  return (
    <>
      <div className='flex flex-col gap-6 h-full'>
        <Draggable type='drag-5' text='Cat' item={{ name: 'Cat' }}>
          <Draggable type='drag-5' text='British' item={{ name: 'British' }}>
            <div className='flex flex-col gap-2'>
              <Draggable
                type='drag-5'
                text='Shorthair'
                item={{ name: 'Shorthair' }}
              />
              <Draggable
                type='drag-5'
                text='Longhair'
                item={{ name: 'Longhair' }}
              />
            </div>
          </Draggable>
        </Draggable>
        <Droppable accept='drag-5' handleDrop={handleDrop} text='Drop Here' className='flex-1' />
      </div>
    </>
  )
}

export default Eg5
