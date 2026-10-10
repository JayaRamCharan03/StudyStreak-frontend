import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Goals from './pages/Goals.jsx';
import Study from './pages/Study.jsx';
import Groups from './pages/Groups.jsx';
import GroupDetail from './pages/GroupDetail.jsx';
import Leaderboard from './pages/Leaderboard.jsx';

function Guard({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Guard><Dashboard /></Guard>} />
      <Route path="/goals" element={<Guard><Goals /></Guard>} />
      <Route path="/study" element={<Guard><Study /></Guard>} />
      <Route path="/groups" element={<Guard><Groups /></Guard>} />
      <Route path="/groups/:id" element={<Guard><GroupDetail /></Guard>} />
      <Route path="/leaderboard" element={<Guard><Leaderboard /></Guard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
