import { createBrowserRouter } from 'react-router-dom'
import Battleship from '../views/Battleship'
import DnDPlayground from '../views/DnDPlayground'
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
  {
    path: '/battleship',
    id: 'Battleship',
    element: <Battleship />,
  },
  {
    path: '/dndplayground',
    id: 'DnDPlayground',
    element: <DnDPlayground />,
  },
  // {
  //   path: '/',
  //   element: <Root />,
  //   errorElement: <ErrorPage />,
  //   loader: rootLoader,
  //   // action: rootAction,
  //   children: [
  //     {
  //       errorElement: <ErrorPage />,
  //       // loader: rootLoader,
  //       action: rootAction,
  //       children: [
  //         { index: true, element: <Index /> },
  //         {
  //           path: 'contacts/:contactId',
  //           element: <Contact />,
  //           loader: contactLoader,
  //           action: contactAction,
  //         },
  //         {
  //           path: 'contacts/:contactId/edit',
  //           element: <EditContact />,
  //           loader: contactLoader,
  //           action: editAction,
  //         },
  //         // {
  //         //   path: 'contacts/:contactId/destroy',
  //         //   action: destroyAction,
  //         //   errorElement: <div>Oops! There was an error.</div>,
  //         // },
  //       ],
  //     },
  //   ],
  // },
])

export default router
