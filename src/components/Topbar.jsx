import Icon from './Icon.jsx';

export default function Topbar({ title, sub, action }) {
  return (
    <div className="tb">
      <div><h1>{title}</h1><div className="sub">{sub}</div></div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button className="btn b2" aria-label="Notifications"><Icon name="bell" /></button>
        {action}
      </div>
    </div>
  );
}
