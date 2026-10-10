import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api.js';
import Icon from '../components/Icon.jsx';
import Topbar from '../components/Topbar.jsx';
import { initial, timeAgo } from '../lib.js';

const statusClass = (s) => (s === 'Done' ? 'tg' : s === 'Pending' ? 'tn' : s === 'Missed' ? 'td' : '');

export default function GroupDetail() {
  const { id } = useParams();
  const [g, setG] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => { api(`/groups/${id}`).then(setG).catch((e) => setError(e.message)); }, [id]);

  if (error) return <div className="err" role="alert">{error}</div>;
  if (!g) return <div className="sub">Loading...</div>;

  async function invite() {
    try { await navigator.clipboard.writeText(g.inviteCode); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard unavailable */ }
  }

  return (
    <>
      <Topbar title={g.name} sub={`${g.members.length} members, invite code ${g.inviteCode}`}
        action={<button className="btn" onClick={invite}><Icon name="plus" />{copied ? 'Code copied' : 'Invite member'}</button>} />
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className="c" style={{ flex: 2 }}>
          <h2>Members this week</h2>
          {g.members.map((m, i) => (
            <div className={'li' + (i === 0 ? ' f' : '')} key={m.userId}>
              <b style={{ width: 24 }}>{m.rank}</b>
              <span className="av">{initial(m.name)}</span>
              <span className="g"><b>{m.name}{m.me ? ' (you)' : ''}</b></span>
              <span className="dots" role="img" aria-label={`${m.weekDays} of 7 days`}>
                {Array.from({ length: 7 }, (_, j) => <i key={j} className={j < m.weekDays ? 'k' : ''} />)}
              </span>
              <span className="tag" style={{ width: 96, textAlign: 'center' }}>{m.streak} day streak</span>
              <span className={'tag ' + statusClass(m.status)} style={{ width: 80, textAlign: 'center' }}>{m.status}</span>
            </div>
          ))}
        </div>
        <div className="c">
          <h2>Recent activity</h2>
          {g.activity.length === 0 && <div className="mut">No study sessions logged yet.</div>}
          {g.activity.map((a, i) => (
            <div className={'li' + (i === 0 ? ' f' : '')} key={i}>
              <span className="av">{initial(a.name)}</span>
              <span className="g"><b>{a.name}</b> {a.text}<div className="mut">{timeAgo(a.at)}</div></span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
