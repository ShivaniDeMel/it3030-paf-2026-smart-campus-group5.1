import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import UserBookings from './pages/UserBookings';
import AdminBookings from './pages/AdminBookings';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;

