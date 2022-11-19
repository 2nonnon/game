import { NavLink } from 'react-router-dom'
import router from '../../routes'

const HomePage = () => {
  return <>
    <div className='flex justify-center items-center h-screen'>
      <nav>
        <ul>
          {
            router.routes.map(route => (<li key={route.id}>
              <NavLink
                to={route.path!}
                className={({ isActive, isPending }) =>
                  isActive
                    ? 'active'
                    : isPending
                      ? 'pending'
                      : ''
                }
              >
                <span>★</span> {route.id}
              </NavLink>
            </li>))
          }
        </ul>
      </nav>
    </div>
  </>
}

export default HomePage
