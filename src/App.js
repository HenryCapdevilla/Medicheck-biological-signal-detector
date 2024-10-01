import './App.css';
import Navbar from './components/home/navbar';
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Divbanner from './components/home/divbanner';
import '@fortawesome/fontawesome-free/css/all.min.css';
import UserCamaraContainer from './components/livingRoom/userCamaraContainer';

function App() {
  return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element=<Divbanner /> />
          <Route path="/videollamada/:id" element=<UserCamaraContainer /> />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
