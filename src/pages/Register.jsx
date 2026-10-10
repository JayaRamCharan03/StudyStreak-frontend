import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import AuthShell from '../components/AuthShell.jsx';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  if (user) return <Navigate to="/" replace />;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    try { await register(f.name, f.email, f.password); navigate('/'); } catch (err) { setError(err.message); }
  }

  return (
    <AuthShell title="Create your account" sub="Start your first streak today." footer={<>Already registered? <Link to="/login">Log in</Link></>}>
      <form onSubmit={submit}>
        {error && <div className="err" role="alert">{error}</div>}
        <label>Full name<input className="in" required placeholder="Aarav Sharma" value={f.name} onChange={set('name')} /></label>
        <label>Email<input className="in" type="email" required placeholder="you@college.edu" value={f.email} onChange={set('email')} /></label>
        <label>Password<input className="in" type="password" required minLength={8} placeholder="At least 8 characters" value={f.password} onChange={set('password')} /></label>
        <button className="btn" style={{ justifyContent: 'center', width: '100%' }}>Sign up</button>
      </form>
    </AuthShell>
  );
}
