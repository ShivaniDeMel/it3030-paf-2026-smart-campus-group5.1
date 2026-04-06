import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './App.css';

function App() {
  return (
    <Router>
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
              </Routes>
            </main>
            
            <Footer />
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
