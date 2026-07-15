import { Routes, Route, Navigate } from "react-router-dom";
import LoginView from "../views/Login.view";
import AppLayout from "../layouts/AppLayout";
import LearningCenter from "../views/LearningCenter.view";
import Lockers from "../views/Lockers.view";
import WifiUsers from "../views/WifiUsers.view";
import { DeviceLoanQueryView } from "../views/DeviceLoanQuery.view";
import { LockerLoanQueryView } from "../views/LockerLoanQuery.view";
import UsersView from "../views/User.view";
import { DevicesMangerView } from "../views/DeviceManager";
import { CheckinQueryView } from "../views/CheckinQuery.view";
import { StudentCheckinRegisterView } from "../views/Checkin.view";
import { Roles } from "../utils/user-states.constants";
import { ProtectedRoute, RoleGuard } from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="login" element={<LoginView />} />

      {/* Primero protegemos que esté logueado */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Redirección inicial */}
          <Route
            index
            element={<Navigate to="/learning-center/prestamos" replace />}
          />

          {/* RUTAS DE USUARIOS */}
          <Route
            path="user"
            element={<RoleGuard allowedRoles={[Roles.LIBRARIAN]} />}
          >
            <Route path="wifi" element={<WifiUsers />} />
            <Route path="manejo" element={<UsersView />} />
          </Route>

          {/* RUTAS DE LEARNING CENTER */}
          <Route
            path="learning-center"
            element={<RoleGuard allowedRoles={[Roles.LEARNING_CENTER]} />}
          >
            <Route path="prestamos" element={<LearningCenter />} />
            <Route path="tabla" element={<DeviceLoanQueryView />} />
            <Route path="manage" element={<DevicesMangerView />} />
          </Route>

          {/* RUTAS DE LOCKERS */}
          <Route
            path="lockers"
            element={<RoleGuard allowedRoles={[Roles.RECEPTION]} />}
          >
            <Route path="prestamos" element={<Lockers />} />
            <Route path="tabla" element={<LockerLoanQueryView />} />
            <Route path="manage" element={<DevicesMangerView />} />
          </Route>

          {/* RUTAS DE CHECKIN */}
          <Route
            path="checkin"
            element={<RoleGuard allowedRoles={[Roles.RECEPTION]} />}
          >
            <Route path="create" element={<StudentCheckinRegisterView />} />
            <Route path="tabla" element={<CheckinQueryView />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
