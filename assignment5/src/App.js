import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Homepage from './components/Homepage';
import CoursesPage from './components/CoursesPage';
import LoginPage from './components/LoginPage';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/courses" 
            element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;