import Icon from './Icon.jsx';

const features = [['target', 'Set daily and weekly study goals'], ['flame', 'Build streaks that reset if you miss a day'], ['users', 'Stay accountable with your study group']];

export default function AuthShell({ title, sub, footer, children }) {
  return (
    <div className="r">
      <div className="hero">
        <div className="br" style={{ margin: 0, color: '#fff' }}><span className="lg" style={{ background: '#4F46E5' }}><Icon name="flame" size={20} /></span>StudyStreak</div>
        <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15 }}>Study a little. Every day. Together.</div>
        {features.map(([ic, t]) => (
          <div className="fe" key={t}><span className="ib"><Icon name={ic} size={20} color="#C7D2FE" /></span><span>{t}</span></div>
        ))}
        <div className="c" style={{ background: '#312E81', borderColor: '#4338CA', color: '#fff', display: 'flex', gap: 14, alignItems: 'center', maxWidth: 300 }}>
          <span style={{ color: '#FDBA74' }}><Icon name="flame" size={30} /></span>
          <div><div className="big">12 days</div><div style={{ color: '#C7D2FE', fontSize: 12 }}>Your current streak</div></div>
        </div>
      </div>
      <div className="auth">
        <h1>{title}</h1>
        <div className="sub" style={{ marginBottom: 24 }}>{sub}</div>
        {children}
        <p className="mut" style={{ textAlign: 'center', marginTop: 18, fontSize: 13 }}>{footer}</p>
      </div>
    </div>
  );
}
