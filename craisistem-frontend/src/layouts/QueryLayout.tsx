import QuerysNavBar from '../components/QuerysNavBar'
import { Outlet } from 'react-router-dom'

function QueryLayout() {
  return (
    <div>
      <QuerysNavBar />
      <Outlet />
    </div>
  )
}

export default QueryLayout