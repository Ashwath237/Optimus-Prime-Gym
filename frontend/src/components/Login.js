import React, { useState } from 'react';
import { api } from '../services/api';
import { sound } from '../utils/soundFx';
import { DumbbellIcon, ShieldIcon, UserIcon } from '../utils/icons';

function Login({ onLoginSuccess, onNavigateRegister, onNavigateManager }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    sound.playClick();
    setError('');
    setLoading(true);

    try {
      const { data, isLive } = await api.login(username || 'ashwath', password || 'password123');
      if (data.token) {
        sound.playSuccess();
        if (onLoginSuccess) {
          onLoginSuccess(data.token, isLive);
        }
      } else {
        setError(data.error || 'Invalid username or password.');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setUsername('ashwath');
    setPassword('password123');
    sound.playClick();
    setTimeout(() => handleSubmit(), 150);
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
            Optimus Prime Systems Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your gym account
          </p>
        </div>

        {/* Login Card */}
        <div className="clean-card p-7 border-slate-800/90 shadow-xl">
          {/* Portal switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0b0f19] rounded-lg border border-slate-800 mb-6">
            <div className="py-2 px-3 rounded-md text-xs font-semibold bg-slate-800 text-white shadow-sm flex items-center justify-center gap-1.5">
              <UserIcon size={14} color="#ffffff" />
              <span>Member Sign In</span>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                if (onNavigateManager) onNavigateManager();
              }}
              className="py-2 px-3 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              <ShieldIcon size={14} color="#94a3b8" />
              <span>Manager Portal</span>
            </button>
          </div>

          <div className="mb-4">
            <h2 className="text-sm font-bold text-white">Athlete &amp; Member Access</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Sign in to view your schedule, digital pass, and reserve class slots.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Member Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. ashwath"
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
              {loading ? 'Authenticating...' : 'Sign In to Member Portal'}
            </button>
          </form>

          {/* Quick Demo */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium transition-colors border border-slate-700/60 cursor-pointer"
            >
              Fill Demo Credentials &amp; Sign In
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            Don't have a membership?{' '}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                if (onNavigateRegister) onNavigateRegister();
              }}
              className="text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;