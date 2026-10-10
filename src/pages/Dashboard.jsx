import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import Icon from '../components/Icon.jsx';
import Topbar from '../components/Topbar.jsx';
import { initial, tick } from '../lib.js';

const level = (c) => (c === 0 ? 0 : c < 2 ? 1 : c < 4 ? 2 : c < 6 ? 3 : 4);
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Stat({ icon, bg, color, value, label }) {
  return (
    <div className="c st">
      <span className="ib" style={{ background: bg, color }}><Icon name={icon} size={22} /></span>
      <div><div className="big">{value}</div><div className="mut">{label}</div></div>
    </div>
  );
}

export default function Dashboard() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const [d, setD] = useState(null);
  const [error, setError] = useState('');
  const load = () => api('/dashboard').then(setD).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  if (error) return <div className="err">{error}</div>;
  if (!d) return <div className="sub">Loading...</div>;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const left = d.todayGoals.filter((g) => !g.done).length;
  const sub = left > 0 ? `${date}. You are ${left} goal${left > 1 ? 's' : ''} away from today's check-in.` : `${date}. All of today's goals are done.`;
  const h = Math.floor(d.minutesThisWeek / 60), m = d.minutesThisWeek % 60;
  const maxv = Math.max(...d.weekly, 1);
  const todayIdx = (new Date().getDay() + 6) % 7;
  const onTick = (g) => tick(g, navigate, async () => { await load(); refresh(); });

  return (
    <>
      <Topbar title={`${greeting}, ${user.name.split(' ')[0]}`} sub={sub}
        action={<button className="btn" onClick={() => navigate('/study')}><Icon name="clock" />Start study session</button>} />
      <div className="row">
        <Stat icon="flame" bg="#FFEDD5" color="#C2410C" value={`${d.currentStreak} days`} label="Current streak" />
        <Stat icon="trophy" bg="#E0E7FF" color="#4338CA" value={`${d.longestStreak} days`} label="Longest streak" />
        <Stat icon="clock" bg="#D1FAE5" color="#047857" value={`${h}h ${m}m`} label="Studied this week" />
        <Stat icon="users" bg="#FCE7F3" color="#9D174D" value={d.groupRank ? `#${d.groupRank}` : '-'} label={d.groupName ? `Rank in ${d.groupName}` : 'Join a group to get ranked'} />
      </div>
      <div className="row">
        <div className="c" style={{ flex: 1.5 }}>
          <h2>Study activity, last 14 weeks</h2>
          <div className="hm">{d.activity.map((c, i) => <i key={i} className={level(c) ? 'l' + level(c) : ''} title={`${c} entries`} />)}</div>
        </div>
        <div className="c">
          <h2>Goals completed this week</h2>
          <svg viewBox="0 0 410 160" width="100%" role="img" aria-label="Daily goals completed this week">
            {d.weekly.map((v, i) => {
              const hh = (v / maxv) * 120;
              return (
                <g key={i}>
                  <rect x={24 + i * 58} y={128 - hh} width="36" height={Math.max(hh, 2)} rx="8" fill={i === todayIdx ? '#F97316' : '#4338CA'} />
                  <text x={42 + i * 58} y="150" fontSize="12" textAnchor="middle" fill="#475569" fontFamily="Plus Jakarta Sans">{DAYS[i]}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <div className="row">
        <div className="c">
          <h2>Today's goals</h2>
          {d.todayGoals.length === 0 && <div className="mut">No daily goals yet. <Link to="/goals">Create one</Link></div>}
          {d.todayGoals.map((g, i) => (
            <div className={'li' + (i === 0 ? ' f' : '')} key={g.id}>
              <button className={'ck' + (g.done ? ' d' : '')} aria-label={`Mark ${g.title}`} onClick={() => onTick(g)}>{g.done && <Icon name="check" size={14} />}</button>
              <span className="g"><b>{g.title}</b><div className="mut">Daily</div></span>
              <span className={'tag ' + (g.done ? 'tg' : 'tn')}>{g.done ? 'Done' : `${g.progress} of ${g.target}`}</span>
            </div>
          ))}
        </div>
        <div className="c">
          <h2>{d.groupName ? `Group snapshot: ${d.groupName}` : 'Group snapshot'}</h2>
          {d.groupSnapshot.length === 0 && <div className="mut">You are not in a group yet. <Link to="/groups">Join or create one</Link></div>}
          {d.groupSnapshot.map((s, i) => (
            <div className={'li' + (i === 0 ? ' f' : '')} key={i}>
              <span className="av">{initial(s.name)}</span><span className="g"><b>{s.name}</b></span><span className="tag">{s.streak} days</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
