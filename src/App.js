import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Divbanner from './components/home/Sctruture/Divbannerdefault';
import '@fortawesome/fontawesome-free/css/all.min.css';
import UserCamaraContainer from './components/livingRoom/userCamaraContainer';
import VideocallContent from './components/videocall/videocallContent';
import RegisterPage from './pages/register/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/login/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';
import UserProfile from './components/profile/UserProfile';
import { VideoProvider } from './context/videoProvider';
import AdminPage from './pages/admin/AdminPage';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import Divbannerdefault from './components/home/Sctruture/Divbannerdefault';
// Importa 'process' y asignalo a window
import process from 'process';
import VideoCallApp from './components/home/videollamada/VideoCallApp';
window.process = process;

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Divbannerdefault />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Divbanner />} />
          <Route path="/Profile" element={<UserProfile />} />
          <Route path="/livingroom/:roomID" element={<UserCamaraContainer />} />
          <Route path="/videocall/:roomID" element={<VideocallContent />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/videollamada" element={<VideoCallApp/>}></Route>
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VideoProvider>
          <AppContent />
        </VideoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
