import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Topbar from '../components/Topbar.jsx';
import { initial } from '../lib.js';

const PAD = { 1: 44, 2: 24, 3: 12 };

export default function Leaderboard() {
  const [scope, setScope] = useState('all');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { api(`/leaderboard?scope=${scope}`).then(setRows).catch((e) => setError(e.message)); }, [scope]);

  const podium = [rows[1], rows[0], rows[2]].filter(Boolean);

  return (
    <>
      <Topbar title="Leaderboard" sub="Ranked by current streak length"
        action={<button className="btn b2" onClick={() => setScope(scope === 'all' ? 'groups' : 'all')}>{scope === 'all' ? 'My groups' : 'All users'}</button>} />
      {error && <div className="err" role="alert">{error}</div>}
      <div className="pd">
        {podium.map((p) => (
          <div className="c" key={p.userId} style={{ paddingTop: PAD[p.rank] || 12 }}>
            <span className="av" style={{ margin: '0 auto 10px', width: 52, height: 52, fontSize: 18 }}>{initial(p.name)}</span>
            <b>{p.name}</b>
            <div className="big" style={{ color: '#C2410C', margin: '6px 0' }}>{p.streak}</div>
            <div className="mut">day streak, rank {p.rank}</div>
          </div>
        ))}
      </div>
      <div className="c">
        <h2>All rankings</h2>
        {rows.map((r, i) => (
          <div className={'li' + (i === 0 ? ' f' : '')} key={r.userId}
            style={r.me ? { background: '#EEF2FF', borderRadius: 10, padding: '13px 12px', border: 0 } : undefined}>
            <b style={{ width: 24 }}>{r.rank}</b>
            <span className="av">{initial(r.name)}</span>
            <span className="g"><b>{r.name}{r.me ? ' (you)' : ''}</b></span>
            <span className="mut" style={{ width: 110 }}>Longest {r.longest}</span>
            <span className="tag">{r.streak} days</span>
          </div>
        ))}
      </div>
    </>
  );
}
