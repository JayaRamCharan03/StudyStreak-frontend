import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import Icon from '../components/Icon.jsx';
import Topbar from '../components/Topbar.jsx';

const tints = ['#E0E7FF', '#FCE7F3', '#D1FAE5'];

export default function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const load = () => api('/groups').then(setGroups).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  async function join() {
    setError('');
    try { const g = await api('/groups/join', { method: 'POST', body: { code } }); navigate(`/groups/${g.id}`); } catch (e) { setError(e.message); }
  }
  async function create() {
    setError('');
    try { const g = await api('/groups', { method: 'POST', body: { name } }); navigate(`/groups/${g.id}`); } catch (e) { setError(e.message); }
  }

  return (
    <>
      <Topbar title="My groups" sub="Small groups keep you honest"
        action={<button className="btn" onClick={() => setCreating(!creating)}><Icon name="plus" />Create group</button>} />
      {error && <div className="err" role="alert">{error}</div>}
      {creating && (
        <div className="c" style={{ maxWidth: 520 }}>
          <h2>Create a group</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <input className="in" style={{ margin: 0 }} placeholder="Placement Prep" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn" onClick={create}>Create</button>
          </div>
        </div>
      )}
      <div className="row" style={{ flexWrap: 'wrap' }}>
        {groups.length === 0 && <div className="mut">You are not in any group yet. Create one or join with an invite code.</div>}
        {groups.map((g, i) => (
          <div className="c" key={g.id} style={{ minWidth: 240 }}>
            <div className="ib" style={{ background: tints[i % 3], marginBottom: 14 }}><Icon name="users" size={22} color="#312E81" /></div>
            <h2 style={{ marginBottom: 4 }}>{g.name}</h2>
            <div className="mut">{g.memberCount} members</div>
            <div style={{ margin: '14px 0' }}><span className="tag">Top streak {g.topStreak} days</span></div>
            <button className="btn b2" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate(`/groups/${g.id}`)}>View group</button>
          </div>
        ))}
      </div>
      <div className="c" style={{ maxWidth: 520 }}>
        <h2>Join with an invite code</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <input className="in" style={{ margin: 0 }} placeholder="GC4821" value={code} onChange={(e) => setCode(e.target.value)} />
          <button className="btn" onClick={join}>Join</button>
        </div>
      </div>
    </>
  );
}
