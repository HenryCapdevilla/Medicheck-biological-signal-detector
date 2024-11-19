import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/Footer/Footer";
import Resume from "./components/Resume/ResumeNew";
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext";
import { VideoProvider } from "./context/videoProvider";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./components/profile/Profile";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import VideoCallApp from "./components/home/videollamada/VideoCallApp";
import AdminPage from "./pages/admin/AdminPage";
import ProtectedAdminRoute from './ProtectedAdminRoute';
import UserCamaraContainer from './components/livingRoom/userCamaraContainer';
import Divbanner from './components/home/Sctruture/CrudRooms';
import RegisterPage from "./pages/register/RegisterPage.jsx";
import LoginPage from "./pages/login/LoginPage.jsx";
import CrudRooms from "./components/home/Sctruture/CrudRooms";
import OffcanvasMenu from "./components/Offcanvas"; // Componente Offcanvas

function AppContent() {
  const [load, updateLoad] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      updateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Rutas donde se mostrará el Offcanvas en lugar del Navbar
  const offcanvasRoutes = ["/livingroom", "/videocall", "/videollamada"];

  // Verifica si la ruta actual está en las rutas de Offcanvas
  const isOffcanvasRoute = offcanvasRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // Ruta específica donde no se debe mostrar el footer
  const noFooterRoutes = ["/videollamada"];
  const isNoFooterRoute = noFooterRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        {isOffcanvasRoute ? <OffcanvasMenu /> : <Navbar />}
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Divbanner />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/homecall" element={<CrudRooms />} />
            <Route path="/livingroom/:roomID" element={<UserCamaraContainer />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/videollamada/:roomID" element={<VideoCallApp />} />
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Routes>
        {/* Renderiza el Footer solo si no es una ruta que contiene '/videollamada/:roomID' */}
        {!isNoFooterRoute && <Footer />}
      </div>
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
