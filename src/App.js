import './App.css';
import Navbar from './components/home/navbar';
import { BrowserRouter, matchPath, Route, Routes, useLocation } from 'react-router-dom';
import Divbanner from './components/home/divbanner';
import '@fortawesome/fontawesome-free/css/all.min.css';
import UserCamaraContainer from './components/livingRoom/userCamaraContainer';
import VideocallContent from './components/videocall/videocallContent';
import RegisterPage from './pages/register/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/login/LoginPage'
import ProtectedRoute from './ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';
import UserProfile from './components/profile/UserProfile';
import { VideoProvider } from './context/videoProvider';
import AdminPage from './pages/admin/AdminPage';
import ProtectedAdminRoute from './ProtectedAdminRoute';
function AppContent() {
  const location = useLocation(); // Ahora se usa dentro de un componente envuelto por BrowserRouter

  const isVideocallPage = matchPath('/videocall/:roomID', location.pathname);
  const shouldShowBanner = !isVideocallPage;

  return (
    <>
      {shouldShowBanner && <Navbar />}
      <Routes>
        <Route path="/" element={<Divbanner />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute/>}>
          <Route path="/livingroom/:roomID" element={<UserCamaraContainer />} />
          <Route path="/videocall/:roomID" element={<VideocallContent />} />
          <Route path="/dashboard" element={<Dashboard/>}></Route>
          <Route path="/Profile" element={<UserProfile/>}></Route>
          <Route element={<ProtectedAdminRoute/>}>
            <Route path="/admin" element={<AdminPage/>}></Route>
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
