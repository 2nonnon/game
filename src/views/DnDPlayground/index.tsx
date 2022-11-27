import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ChessExample from './ChessExample'
import Container from './Container'
import DragAround from './DragAround'
import MutipleTarget from './MutipleTarget'
import NestedDraggable from './NestedDraggable'
import NestedDroppable from './NestedDroppable'
import RealDrop from './RealDrop'
import SingleTarget from './SingleTarget'
import Sortable from './Sortable'

const DnDPlayground = () => {
  return (
    <div className='p-6 min-h-screen bg-gray-100 select-none'>
      <h1 className='text-center mb-6'>React Drag & Drop Playground</h1>
      <DndProvider backend={HTML5Backend}>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <Container title='Chess Example'>
            <ChessExample></ChessExample>
          </Container>
          <Container title='Single Target'>
            <SingleTarget></SingleTarget>
          </Container>
          <Container title='Mutiple Target'>
            <MutipleTarget></MutipleTarget>
          </Container>
          <Container title='Real Drop'>
            <RealDrop></RealDrop>
          </Container>
          <Container title='Drag Around'>
            <DragAround></DragAround>
          </Container>
          <Container title='Nested Draggable'>
            <NestedDraggable></NestedDraggable>
          </Container>
          <Container title='Nested Droppable'>
            <NestedDroppable></NestedDroppable>
          </Container>
          <Container title='Sortable'>
            <Sortable></Sortable>
          </Container>
        </div>
      </DndProvider>
    </div>
  )
}

export default DnDPlayground
