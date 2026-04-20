import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import FacilitiesCatalogue from './pages/FacilitiesCatalogue';
import FacilityDetails from './pages/FacilityDetails';
import AddFacility from './pages/AddFacility';
import EditFacility from './pages/EditFacility';
import BookingWorkflow from './pages/BookingWorkflow';
import './App.css';
=======
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import UserBookings from './pages/UserBookings';
import AdminBookings from './pages/AdminBookings';
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white text-gray-900 min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/facilities" element={<FacilitiesCatalogue />} />
                <Route path="/facilities/:id" element={<FacilityDetails />} />
                <Route path="/facilities/add" element={<AddFacility />} />
                <Route path="/facilities/edit/:id" element={<EditFacility />} />
                <Route path="/booking-workflow/:id" element={<BookingWorkflow />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </div>
      </AuthProvider>
=======
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<UserBookings />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/bookings" element={<UserBookings />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
          </Routes>
        </main>
        <Footer />
      </div>
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a
    </Router>
  );
}

export default App;
<<<<<<< HEAD
=======

>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a
