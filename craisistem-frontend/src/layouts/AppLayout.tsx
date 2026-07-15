import { Outlet } from "react-router-dom";
import AppNavBar from "../components/AppNavBar";

export default function AppLayout() {
  return (
    <>
      <AppNavBar />
      <Outlet />
    </>
  );
}
