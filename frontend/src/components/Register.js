import React, { useState } from 'react';
import { api } from '../services/api';
import { sound } from '../utils/soundFx';
import { DumbbellIcon } from '../utils/icons';

function Register({ onNavigateLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');
  const [age, setAge] = useState('24');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    sound.playClick();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.register(username, email, password, Number(age), fitnessLevel);
      if (data.message === 'User registered successfully') {
        sound.playSuccess();
        setSuccess('Account created successfully! Redirecting to sign in...');
        setTimeout(() => {
          if (onNavigateLogin) onNavigateLogin();
          else window.location.href = '/login';
        }, 1200);
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Registration error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="w-full max-w-lg my-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-800 text-white mb-3 shadow-md">
            <DumbbellIcon size={22} color="#ffffff" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Create Member Account
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign up for access to classes, bookings, and facility amenities
          </p>
        </div>

        <div className="clean-card p-7 border-slate-800/90 shadow-xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Username
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="24"
                  className="clean-input w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ash@example.com"
                className="clean-input w-full"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="clean-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="clean-input w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Fitness Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setFitnessLevel(lvl);
                    }}
                    className={`py-2 px-3 rounded-lg border text-center text-xs font-medium cursor-pointer transition-colors ${
                      fitnessLevel === lvl
                        ? 'border-emerald-700 bg-emerald-950/60 text-emerald-300 font-semibold'
                        : 'border-slate-700 bg-[#0b0f19] text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-xs font-semibold cursor-pointer shadow-sm mt-4"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                if (onNavigateLogin) onNavigateLogin();
                else window.location.href = '/login';
              }}
              className="text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;