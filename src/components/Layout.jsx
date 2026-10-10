import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import Icon from './Icon.jsx';
import { initial } from '../lib.js';

const items = [['/', 'Dashboard', 'home'], ['/goals', 'Goals', 'target'], ['/study', 'Study', 'clock'], ['/groups', 'Groups', 'users'], ['/leaderboard', 'Leaderboard', 'trophy']];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="r">
      <nav className="sb">
        <div className="br"><span className="lg"><Icon name="flame" size={20} /></span>StudyStreak</div>
        {items.map(([to, label, ic]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'on' : '')}><Icon name={ic} />{label}</NavLink>
        ))}
        <div style={{ flex: 1 }} />
        <div className="c usercard">
          <span className="av">{initial(user.name)}</span>
          <div className="g"><b>{user.name}</b><div className="mut">{user.currentStreak} day streak</div></div>
        </div>
        <a href="/login" onClick={(e) => { e.preventDefault(); logout(); navigate('/login'); }}><Icon name="logout" />Log out</a>
      </nav>
      <main className="m">{children}</main>
    </div>
  );
}
