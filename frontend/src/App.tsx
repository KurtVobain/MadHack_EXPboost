import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css'
import Header from './componets/Header';
import ProtectedRoute from './componets/ProtectedRoute';
import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

function Layout() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/'  && <Header/>}
      <div className='max-w-7xl my-0 mx-auto'>
        <Routes>
          <Route path='/' element={<LoginPage  />} />
          <Route path='/dashboard' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path='/courses' element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
          {/* <Route path='*' element={<NotFoundPage />}/> */}
        </Routes>
      </div>
    </>
  );
}

export default App