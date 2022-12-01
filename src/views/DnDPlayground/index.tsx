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
import { Container as C1 } from './Dustbin/SingleTarget/Container'
import { Container as C2 } from './Dustbin/WithinAnIframe/Container'
import { Container as C3 } from './Dustbin/CopyOrMove/Container'
import { Container as C4 } from './Dustbin/MultipleTargets/Container'
import { Container as C5 } from './Dustbin/StressTest/Container'
import { Example as C6 } from './DragAround/Naive/Example'
import { Example as C7 } from './DragAround/CustomDragLayer/Example'
import { Container as C8 } from './Nesting/DragSources/Container'
import { Container as C9 } from './Nesting/DropTargets/Container'
import { Container as C10 } from './Sortable/Simple/Container'
import { Container as C11 } from './Sortable/CancelOnDropOutside/Container'
// import { Container as C12 } from './Sortable/StressTest/Container'
import { Container as C13 } from './Customize/DropEffects/Container'
import { Container as C14 } from './Customize/HandlesAndPreviews/Container'
import { Container as C15 } from './OtherCases/NativeFiles/Container'
import { Container as C16 } from './OtherCases/NativeHtml/Container'

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
          <C1></C1>
          <C2></C2>
          <C3></C3>
          <C4></C4>
          <C5></C5>
          <C6></C6>
          <C7></C7>
          <C8></C8>
          <C9></C9>
          <C10></C10>
          <C11></C11>
          {/* <C12></C12> */}
          <C13></C13>
          <C14></C14>
          <C15></C15>
          <C16></C16>
        </div>
      </DndProvider>
    </div>
  )
}

export default DnDPlayground
