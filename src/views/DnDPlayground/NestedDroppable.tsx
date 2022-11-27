import Draggable from './Draggable'
import Droppable from './Droppable'

function Eg6() {
  const handleOuter = (_item: any, monitor: any, _state: any) => {
    if (!!monitor.didDrop() && !!monitor.getDropResult())
      return
    // eslint-disable-next-line no-alert
    alert('Outer!')
  }
  const handleMiddle = (_item: any, monitor: any, _state: any) => {
    if (!!monitor.didDrop() && !!monitor.getDropResult())
      return
    // eslint-disable-next-line no-alert
    alert('Middle!')
  }
  const handleInner = (_item: any, monitor: any, _state: any) => {
    if (!!monitor.didDrop() && !!monitor.getDropResult())
      return
    // eslint-disable-next-line no-alert
    alert('Inner!')
  }
  return (
    <>
      <div className='flex flex-col gap-6 h-full'>
        <div className='flex justify-center'>
          <Draggable type='drag-6' text='Drag Me' />
        </div>
        <div className='flex-1'>
          <Droppable accept='drag-6' text='Outer' handleDrop={handleOuter} className='h-full p-4 flex gap-2'>
            <Droppable accept='drag-6' text='Middle' handleDrop={handleMiddle} className='h-1/2 p-4 flex gap-2'>
              <Droppable accept='drag-6' text='Inner' handleDrop={handleInner} className='h-1/2'/>
            </Droppable>
          </Droppable>
        </div>
      </div>
    </>
  )
}

export default Eg6
