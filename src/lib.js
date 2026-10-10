import { api } from './api.js';

export const initial = (n) => (n || '?').charAt(0).toUpperCase();

export function timeAgo(iso) {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 1) return 'just now';
  if (m < 60) return `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
  return `${Math.round(h / 24)} days ago`;
}

export const typeLabel = { COUNT: 'Count goal', MINUTES: 'Minutes goal', CHECKLIST: 'Checklist goal' };

export function progressText(g) {
  if (g.type === 'MINUTES') return `${g.progress} of ${g.target} min`;
  if (g.type === 'CHECKLIST') return `${g.progress} of ${g.target} tasks`;
  return `${g.progress} of ${g.target}`;
}

/** Tick a goal: count/checklist goals get a check-in, minute goals go to the study timer. */
export async function tick(g, navigate, after) {
  if (g.done) return;
  if (g.type === 'MINUTES') return navigate('/study');
  await api(`/goals/${g.id}/checkin`, { method: 'POST', body: {} });
  await after();
}
