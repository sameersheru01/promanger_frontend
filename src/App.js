import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './auth/Procetedroutes';
import Board from './components/Board';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import CardPage from './pages/CardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route path='/login' element={<AuthPage />} />
        <Route path='/card/:id' element={<CardPage />} />
        <Route element={<ProtectedRoute/>}>
        <Route path='/dashboard' element={<Dashboard />} >
          <Route index element={<Board />} />
           <Route path='board' element={<Board />} />
           <Route path='analytics' element={<Analytics />} />
           <Route path='settings' element={<Settings />} />
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
