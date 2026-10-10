import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import AuthShell from '../components/AuthShell.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  if (user) return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault();
    setError('');
    try { await login(email, password); navigate('/'); } catch (err) { setError(err.message); }
  }

  return (
    <AuthShell title="Welcome back" sub="Log in to continue your streak." footer={<>New here? <Link to="/register">Create an account</Link></>}>
      <form onSubmit={submit}>
        {error && <div className="err" role="alert">{error}</div>}
        <label>Email<input className="in" type="email" required placeholder="you@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input className="in" type="password" required placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button className="btn" style={{ justifyContent: 'center', width: '100%' }}>Log in</button>
      </form>
    </AuthShell>
  );
}
