import type { ActionFunctionArgs } from 'react-router-dom'
import { redirect } from 'react-router-dom'
import { deleteContact } from '../contacts'

export async function action({ params }: ActionFunctionArgs) {
  console.log('destroy action', { params })
  await deleteContact(params.contactId!)
  return redirect('/')
}
