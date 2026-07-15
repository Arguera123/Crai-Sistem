import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { name: 'Estadísticas', href: '/querys/stats' },
  { name: 'Consultas', href: '/querys/tables' },
]

function QuerysNavBar() {
  const location = useLocation()

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <nav className="w-full flex gap-6 items-center justify-center my-6">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          to={tab.href}
          className={classNames(
            location.pathname === tab.href
              ? 'text-blue-500 underline decoration-2 underline-offset-4'
              : 'text-black hover:text-gray-500 hover:underline hover:decoration-gray-400 hover:underline-offset-4',
            'group inline-flex items-center py-4 px-1 text-xl font-medium transition-all duration-150'
          )}
        >
          <span>{tab.name}</span>
        </Link>
      ))}
    </nav>
  )
}

export default QuerysNavBar
