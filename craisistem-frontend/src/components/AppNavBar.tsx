import { useMemo } from "react"; 
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { 
  ArrowRightStartOnRectangleIcon, 
  ChevronDownIcon, 
  ComputerDesktopIcon,
  UserIcon 
} from "@heroicons/react/16/solid";
import { 
  AssignmentReturn, 
  HowToReg, 
  TableChart, 
  Wifi 
} from "@mui/icons-material";
import { Roles } from "../utils/user-states.constants";
import { useAuth } from "../hooks/authProvider";

const navigation = [
  {
    name: 'Usuarios',
    roles: [Roles.LIBRARIAN],
    children: [
      { name: 'Usuarios', href: '/user/manejo', icon: UserIcon, desc: 'Manejo de usuarios' },
      { name: 'Usuarios Wifi', href: '/user/wifi', icon: Wifi, desc: 'Manejo de usuarios wifi' }
    ]
  },
  {
    name: 'Learning center',
    roles: [Roles.LEARNING_CENTER],
    children: [
      { name: 'Dispositivos', href: '/learning-center/manage', icon: ComputerDesktopIcon, desc: 'Administrador de equipo informatico' },
      { name: 'Prestamos', href: '/learning-center/prestamos', icon: AssignmentReturn, desc: 'Prestamo de equipo informatico' },
      { name: 'Consultas', href: '/learning-center/tabla', icon: TableChart, desc: 'Tabla de prestamos de equipo informatico' }
    ]
  },
  {
    name: 'Lockers',
    roles: [Roles.RECEPTION],
    children: [
      { name: 'Prestamos', href: '/lockers/prestamos', icon: AssignmentReturn, desc: 'Prestamo de equipo informatico' },
      { name: 'Consultas', href: '/lockers/tabla', icon: TableChart, desc: 'Tabla de prestamos de casilleros' }
    ]
  },
  {
    name: 'Checkin',
    roles: [Roles.RECEPTION],
    children: [
      { name: 'Checkin', href: '/checkin/create', icon: HowToReg, desc: 'Registrar ingresos' },
      { name: 'Consultas', href: '/checkin/tabla', icon: TableChart, desc: 'Tabla de ingresos' },
    ]
  }
];

export default function AppNavBar() {
  const { user, logout, isLoading } = useAuth(); 
  
  const filteredNavigation = useMemo(() => {
    if (!user) return [];

    const userRoles = user?.roles || [];
    const isAdmin = userRoles.some(
      (role: { toString: () => string; }) => role.toString().toLowerCase() === Roles.ADMIN.toLowerCase()
    );

    if (isAdmin) return navigation;

    return navigation.filter(group => 
      group.roles.some(navRole => 
        userRoles.some((uRole: { toString: () => string; }) => uRole.toString().toLowerCase() === navRole.toLowerCase())
      )
    );
  }, [user]);

  if (isLoading) return <div className="h-20 bg-white border-b w-full fixed top-0" />;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#083C6C] border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
            <div className="border-l border-gray-200 pl-3">
              <p className="text-gray-300 font-bold text-sm leading-4 tracking-tight">BIBLIOTECA</p>
              <p className="text-gray-100 text-[10px] font-medium uppercase">P. Florentino Idoate S.J.</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {filteredNavigation.map((group) => (
              <div key={group.name} className="relative group py-6">
                <button className="flex items-center gap-1 text-sm font-semibold text-gray-300 group-hover:text-gray-600 transition-colors">
                  {group.name}
                  <ChevronDownIcon className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>

                <div className="absolute left-0 top-full w-72 pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
                  <div className="bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden p-2">
                    {group.children.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors group/item"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 group-hover/item:bg-white group-hover/item:text-blue-600 text-gray-400 shadow-sm transition-all">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 leading-none mb-1">{item.name}</p>
                          <p className="text-xs text-gray-500 leading-snug">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="h-6 w-px bg-gray-200 mx-2" />

            {user && (
              <div className="flex flex-col items-end mr-2">
                <p className="text-[10px] font-bold text-gray-200 uppercase leading-none">
                  {user.roles?.join(" / ")}
                </p>
                <p className="text-xs font-medium text-gray-300">
                  {user.lastName} {user.firstName} 
                </p>
              </div>
            )}

            <button
              onClick={logout} 
              className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}