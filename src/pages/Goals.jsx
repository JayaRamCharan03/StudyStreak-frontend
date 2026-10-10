import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import Icon from '../components/Icon.jsx';
import Topbar from '../components/Topbar.jsx';
import { progressText, tick, typeLabel } from '../lib.js';

const empty = { title: '', type: 'MINUTES', frequency: 'DAILY', target: '', subject: '', resourceUrl: '' };

export default function Goals() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [f, setF] = useState(empty);
  const [error, setError] = useState('');
  const load = () => api('/goals').then(setGoals).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      await api('/goals', { method: 'POST', body: { ...f, target: Number(f.target) } });
      setF(empty);
      load();
    } catch (err) { setError(err.message); }
  }

  const shown = goals.filter((g) => filter === 'ALL' || g.frequency === filter);
  const count = (x) => goals.filter((g) => g.frequency === x).length;
  const tab = (key, label) => <button key={key} className={'tag ' + (filter === key ? 'ti' : 'tn')} onClick={() => setFilter(key)}>{label}</button>;

  return (
    <>
      <Topbar title="My goals" sub="Daily and weekly targets that feed your streak"
        action={<button className="btn" onClick={() => document.getElementById('goal-title').focus()}><Icon name="plus" />New goal</button>} />
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className="c" style={{ flex: 2 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
            {tab('ALL', `All ${goals.length}`)}{tab('DAILY', `Daily ${count('DAILY')}`)}{tab('WEEKLY', `Weekly ${count('WEEKLY')}`)}
          </div>
          {shown.length === 0 && <div className="mut" style={{ padding: '14px 0' }}>No goals here yet. Create your first one on the right.</div>}
          {shown.map((g) => (
            <div className="li" key={g.id}>
              <button className={'ck' + (g.done ? ' d' : '')} aria-label={`Mark ${g.title}`} onClick={() => tick(g, navigate, async () => { await load(); refresh(); })}>{g.done && <Icon name="check" size={14} />}</button>
              <span className="g"><b>{g.title}</b><div className="mut">{typeLabel[g.type]}, {progressText(g)}</div></span>
              <span className={'tag ' + (g.frequency === 'WEEKLY' ? 'tg' : '')}>{g.frequency === 'WEEKLY' ? 'Weekly' : 'Daily'}</span>
              <span className="tag ti" style={{ width: 100, textAlign: 'center' }}>Streak {g.streak}</span>
              <div className="bar"><i style={{ width: Math.min(100, (g.progress / g.target) * 100) + '%' }} /></div>
            </div>
          ))}
        </div>
        <form className="c" onSubmit={save}>
          <h2>Create a goal</h2>
          {error && <div className="err" role="alert">{error}</div>}
          <label>Title<input id="goal-title" className="in" required placeholder="Practice 3 SQL queries" value={f.title} onChange={set('title')} /></label>
          <label>Goal type
            <select className="in" value={f.type} onChange={set('type')}>
              <option value="MINUTES">Minutes (study time)</option><option value="COUNT">Count (e.g. problems)</option><option value="CHECKLIST">Checklist (tasks)</option>
            </select>
          </label>
          <label>Repeats
            <select className="in" value={f.frequency} onChange={set('frequency')}><option value="DAILY">Daily</option><option value="WEEKLY">Weekly</option></select>
          </label>
          <label>Target<input className="in" type="number" min="1" required placeholder="60" value={f.target} onChange={set('target')} /></label>
          <label>Subject<input className="in" placeholder="DSA, OS, Maths" value={f.subject} onChange={set('subject')} /></label>
          <label>Study material link<input className="in" type="url" placeholder="https://youtube.com/playlist..." value={f.resourceUrl} onChange={set('resourceUrl')} /></label>
          <button className="btn" style={{ width: '100%', justifyContent: 'center' }}>Save goal</button>
        </form>
      </div>
    </>
  );
}
