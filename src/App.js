import './App.css';
import Navbar from './components/home/navbar';
import { BrowserRouter, Route, Routes, useLocation, matchPath } from 'react-router-dom';
import Divbanner from './components/home/divbanner';
import '@fortawesome/fontawesome-free/css/all.min.css';
import UserCamaraContainer from './components/livingRoom/userCamaraContainer';
import VideocallContent from './components/videocall/videocallContent';

function AppContent() {
  const location = useLocation(); // Obtiene la ubicación actual de la ruta

  // Verifica si la ruta actual coincide con "/videocall/:roomID"
  const isVideocallPage = matchPath('/videocall/:roomID', location.pathname);

  // Determina si se debe mostrar el banner: 
  // El banner no se muestra en "/videocall/:roomID", pero sí en otras rutas
  const shouldShowBanner = !isVideocallPage;

  return (
    <>
      {/* Mostrar Divbanner si no estamos en /videocall/:roomID */}
      {shouldShowBanner && <Navbar />}
      <Routes>
        <Route path="/" element={<Divbanner />} />
        <Route path="/livingroom/:roomID" element={<UserCamaraContainer />} />
        <Route path="/videocall/:roomID" element={<VideocallContent />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
