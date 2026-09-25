import React, { useState } from 'react';
import { sound } from './utils/soundFx';
import { ShieldIcon, DumbbellIcon } from './utils/icons';

function ManagerLogin({ onLoginSuccess, onBackToMember }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    sound.playClick();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login-manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid credentials');
        setLoading(false);
        return;
      }

      sound.playSuccess();
      localStorage.setItem('managerToken', data.token);
      localStorage.setItem('managerId', data.managerId);

      if (onLoginSuccess) {
        onLoginSuccess(data.token, data.managerId);
      }
    } catch (err) {
      setError('Could not connect to server. Check that the backend is running.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-800 text-white mb-3 shadow-md">
            <DumbbellIcon size={22} color="#ffffff" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Optimus Prime Systems — Manager Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Restricted access · Staff credentials required
          </p>
        </div>

        <div className="clean-card p-7 border-slate-800/90 shadow-xl">
          {/* Manager badge */}
          <div className="flex items-center gap-2 mb-5 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
            <ShieldIcon size={15} color="#4ade80" />
            <span className="text-xs font-semibold text-emerald-400">Manager Authentication</span>
          </div>

          <div className="mb-5">
            <h2 className="text-sm font-bold text-white">Staff Sign In</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Access club analytics, class management, trainer roster, and member directory.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. manager_01"
                className="clean-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="clean-input w-full"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-xs font-semibold cursor-pointer shadow-sm mt-2"
            >
              {loading ? 'Authenticating...' : 'Enter Manager Dashboard'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                if (onBackToMember) onBackToMember();
              }}
              className="w-full py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium transition-colors border border-slate-700/60 cursor-pointer"
            >
              ← Back to Member Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerLogin;