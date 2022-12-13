import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../views/HomePage'
import QrcodeGenerator from '../views/QRCode'

const router = createBrowserRouter([
  {
    path: '/',
    id: 'HomePage',
    element: <HomePage />,
  },
  {
    path: '/qrcode',
    id: 'QrcodeGenerator',
    element: <QrcodeGenerator />,
  },
])

export default router
