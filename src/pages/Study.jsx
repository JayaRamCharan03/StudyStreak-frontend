import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import Icon from '../components/Icon.jsx';
import Topbar from '../components/Topbar.jsx';

const C = 628;
const pad = (n) => String(n).padStart(2, '0');

export default function Study() {
  const { refresh } = useAuth();
  const [goals, setGoals] = useState([]);
  const [goalId, setGoalId] = useState('');
  const [len, setLen] = useState(25);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState('');
  const [today, setToday] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const loadToday = () => api('/sessions/today').then(setToday).catch((e) => setError(e.message));
  useEffect(() => {
    api('/goals').then((g) => { setGoals(g); if (g.length) setGoalId(String(g[0].id)); }).catch((e) => setError(e.message));
    loadToday();
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const total = len * 60;
  const left = Math.max(0, total - elapsed);
  useEffect(() => { if (running && left === 0) setRunning(false); }, [left, running]);

  const goal = goals.find((g) => String(g.id) === goalId);
  const frac = Math.min(1, elapsed / total);
  const minutes = Math.max(1, Math.round(elapsed / 60));
  const totalToday = today.reduce((s, x) => s + x.minutes, 0);

  async function save() {
    setError(''); setMsg('');
    if (!goal) return setError('Create a goal first, then start a session.');
    if (elapsed === 0) return setError('Start the timer before saving a session.');
    try {
      await api('/sessions', { method: 'POST', body: { goalId: goal.id, minutes, note } });
      setRunning(false); setElapsed(0); setNote('');
      setMsg(`Session saved: ${minutes} min on ${goal.title}`);
      loadToday(); refresh();
    } catch (e) { setError(e.message); }
  }

  const sessionLabel = running ? 'Pause' : elapsed > 0 && left > 0 ? 'Resume' : 'Start';

  return (
    <>
      <Topbar title="Study session" sub="Focus on one goal at a time. Time is saved to your goal automatically." />
      {error && <div className="err" role="alert">{error}</div>}
      {msg && <div className="ok" role="status">{msg}</div>}
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className="c" style={{ flex: 1.2, textAlign: 'center', padding: 28 }}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
            <select className="tag" aria-label="Goal" value={goalId} disabled={elapsed > 0} onChange={(e) => setGoalId(e.target.value)}>
              {goals.length === 0 && <option>No goals yet</option>}
              {goals.map((g) => <option key={g.id} value={g.id}>Goal: {g.title}</option>)}
            </select>
            <span className="tag tn">Subject: {goal?.subject || 'None'}</span>
            {[25, 50].map((n) => (
              <button key={n} className={'tag ' + (len === n ? 'ti' : 'tn')} disabled={elapsed > 0} onClick={() => setLen(n)}>{n} min focus</button>
            ))}
          </div>
          <svg width="240" height="240" viewBox="0 0 240 240" role="img" aria-label={`${pad(Math.floor(left / 60))} minutes ${pad(left % 60)} seconds remaining`}>
            <circle cx="120" cy="120" r="100" fill="none" stroke="#E2E8F0" strokeWidth="14" />
            <circle cx="120" cy="120" r="100" fill="none" stroke="#4338CA" strokeWidth="14" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 120 120)" />
            <text x="120" y="128" textAnchor="middle" fontSize="46" fontWeight="700" fill="#0F172A" fontFamily="Plus Jakarta Sans">{pad(Math.floor(left / 60))}:{pad(left % 60)}</text>
            <text x="120" y="156" textAnchor="middle" fontSize="13" fill="#475569" fontFamily="Plus Jakarta Sans">of {len} minutes</text>
          </svg>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 22 }}>
            <button className="btn" onClick={() => setRunning(!running)} disabled={left === 0}>{sessionLabel}</button>
            <button className="btn b2" onClick={() => setRunning(false)}>End session</button>
          </div>
          <div style={{ marginTop: 20 }}>
            {goal?.resourceUrl
              ? <a className="btn b2" style={{ width: '100%', justifyContent: 'center' }} href={goal.resourceUrl} target="_blank" rel="noreferrer"><Icon name="link" />Open study material</a>
              : <button className="btn b2" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMsg('Add a study material link to this goal on the Goals page.')}><Icon name="link" />Open study material</button>}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
          <div className="c">
            <h2>What did you cover?</h2>
            <textarea className="in" rows={4} maxLength={500} placeholder="Scheduling algorithms, round robin and priority. Solved 4 problems." value={note} onChange={(e) => setNote(e.target.value)} />
            <button className="btn" style={{ width: '100%', justifyContent: 'center' }} onClick={save}>Save session</button>
          </div>
          <div className="c">
            <h2>Today's sessions</h2>
            {today.length === 0 && <div className="mut">No sessions yet today.</div>}
            {today.map((s) => (
              <div className="li" key={s.id}>
                <span className="ib" style={{ background: '#E0E7FF', color: '#4338CA', width: 38, height: 38 }}><Icon name="clock" /></span>
                <span className="g"><b>{s.goalTitle}</b><div className="mut">{s.note || 'No note'}, {new Date(s.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div></span>
                <span className="tag ti">{s.minutes} min</span>
              </div>
            ))}
            <div className="li"><span className="g mut">Total today</span><b>{Math.floor(totalToday / 60)}h {totalToday % 60}m</b></div>
          </div>
        </div>
      </div>
    </>
  );
}
