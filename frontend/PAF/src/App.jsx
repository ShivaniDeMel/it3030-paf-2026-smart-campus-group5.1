import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import NotificationsPage from "./components/NotificationsPage";
import RoleManagementPage from "./components/RoleManagementPage";
import BookingWorkflowPage from "./components/BookingWorkflowPage";
import TicketListPage from "./components/TicketListPage";
import TicketDetailPage from "./components/TicketDetailPage";
import TicketSubmissionForm from "./components/TicketSubmissionForm";
import Dashboard from "./pages/Dashboard";
import FacilitiesCatalogue from "./pages/FacilitiesCatalogue";
import FacilityDetails from "./pages/FacilityDetails";
import BookingWorkflow from "./pages/BookingWorkflow";
import MyBookings from "./pages/MyBookings";
import ProfilePage from "./pages/ProfilePage";
import AddFacility from "./pages/AddFacility";
import EditFacility from "./pages/EditFacility";

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
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="facilities" element={<FacilitiesCatalogue />} />
        <Route path="facilities/add" element={<AddFacility />} />
        <Route path="facilities/:id" element={<FacilityDetails />} />
        <Route path="facilities/:id/edit" element={<EditFacility />} />
        <Route path="booking-workflow/:id" element={<BookingWorkflow />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="tickets" element={<TicketListPage />} />
        <Route path="tickets/new" element={<TicketSubmissionForm />} />
        <Route path="tickets/:id" element={<TicketDetailPage />} />
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
