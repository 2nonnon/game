import type { FunctionComponent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom'
import { Form, redirect, useFetcher, useLoaderData } from 'react-router-dom'

import type { Contact as _Contact } from '../contacts'
import { deleteContact, getContact, updateContact } from '../contacts'

export async function loader({ params }: LoaderFunctionArgs) {
  console.log('contact loader', { params })
  const contact = await getContact(params.contactId!)
  if (!contact) {
    throw new Response('', {
      status: 404,
      statusText: 'Not Found',
    })
  }
  return contact
}

const handlePost = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData()
  return updateContact(params.contactId!, {
    favorite: formData.get('favorite') === 'true',
  })
}

const handleDelete = async ({ params }: ActionFunctionArgs) => {
  await deleteContact(params.contactId!)
  return redirect('/')
}

export async function action({ request, params }: ActionFunctionArgs) {
  console.log('contact action', { request, params })
  switch (request.method) {
    case 'POST':
      return await handlePost({ request, params })
    case 'DELETE':
      return await handleDelete({ request, params })
    default:
      throw new Error('not found')
  }
}

function Confirm({ setModal }: { setModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <div className='p-5 bg-white shadow-md rounded-xl'>
      <div>Please confirm you want to delete this record.</div>
      <div className='flex justify-evenly items-center mt-3'>
        <Form
          method="delete"
          // action="destroy"
        >
          <button type="submit" className='text-[#f44250]'>Confirm</button>
        </Form>
        <button type="submit" onClick={() => setModal(false)}>Cancel</button>
      </div>
    </div>
  )
}

const Modal: FunctionComponent<{ children: any }> = ({ children }) => {
  const modalRoot = document.body
  const elRef = useRef<HTMLDivElement | null>(null)
  if (!elRef.current)
    elRef.current = document.createElement('div')

  useEffect(() => {
    modalRoot!.appendChild(elRef.current!)
    return () => { modalRoot!.removeChild(elRef.current!) }
  }, [])

  return createPortal(<div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>{children}</div>, elRef.current)
}

export default function Contact() {
  const contact = useLoaderData() as _Contact
  const [modal, setModal] = useState(false)
  console.log('contact', modal)

  return (
    <>
      {modal ? <Modal><Confirm setModal={setModal} /></Modal> : null}
      <div id="contact">
        <div>
          <img
            key={contact.avatar}
            src={contact.avatar}
          />
        </div>

        <div>
          <h1>
            {contact.first || contact.last
              ? (
                  <>
                    {contact.first} {contact.last}
                  </>
                )
              : (
                  <i>No Name</i>
                )}{' '}
            <Favorite contact={contact} />
          </h1>

          {contact.twitter && (
            <p>
              <a
                target="_blank"
                href={`https://twitter.com/${contact.twitter}`}
              >
                {contact.twitter}
              </a>
            </p>
          )}

          {contact.notes && <p>{contact.notes}</p>}

          <div>
            <Form action="edit">
              <button type="submit">Edit</button>
            </Form>
            <Form
              method="delete"
              // action="destroy"
              onSubmit={(event) => {
                event.preventDefault()
                setModal(true)
              }}
            >
              <button type="submit" className='text-[#f44250]'>Delete</button>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}

function Favorite({ contact }: { contact: _Contact }) {
  const fetcher = useFetcher()
  let favorite = contact.favorite

  if (fetcher.formData)
    favorite = fetcher.formData.get('favorite') === 'true'

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? 'false' : 'true'}
        aria-label={
          favorite
            ? 'Remove from favorites'
            : 'Add to favorites'
        }
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  )
}
