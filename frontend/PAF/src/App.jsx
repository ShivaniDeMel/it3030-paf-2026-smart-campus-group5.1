import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import PlaceholderPage from "./components/PlaceholderPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import NotificationsPage from "./components/NotificationsPage";
import RoleManagementPage from "./components/RoleManagementPage";
import BookingWorkflowPage from "./components/BookingWorkflowPage";

function Layout() {
  return (
    <div className="app-shell flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 flex-col min-h-0">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="dashboard"
          element={<PlaceholderPage title="Dashboard" />}
        />
        <Route
          path="facilities"
          element={<PlaceholderPage title="Facilities" />}
        />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="booking-workflow" element={<BookingWorkflowPage />} />
        <Route path="role-management" element={<RoleManagementPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App;
