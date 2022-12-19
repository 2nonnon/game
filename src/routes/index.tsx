import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../views/HomePage'
import MineSweeper from '../views/MineSweeper'

const router = createBrowserRouter([
  {
    path: '/',
    id: 'HomePage',
    element: <HomePage />,
  },
  {
    path: '/minesweeper',
    id: 'MineSweeper',
    element: <MineSweeper />,
  },
])

export default router
