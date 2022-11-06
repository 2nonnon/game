import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import './index.css'
import QrcodeGenerator from './views/QRCode'

const router = createBrowserRouter([
  {
    path: '/',
    element: <QrcodeGenerator/>,
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
