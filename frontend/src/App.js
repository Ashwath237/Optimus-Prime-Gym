import React, { useState, useEffect } from 'react';
import ManagerLogin from './ManagerLogin';
import ManagerDashboard from './ManagerDashboard';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ClassesPage from './components/ClassesPage';
import MemberBookings from './components/MemberBookings';
import AttendanceCheckin from './components/AttendanceCheckin';
import TrainersPage from './components/TrainersPage';
import BodyMetrics from './components/BodyMetrics';
import { sound } from './utils/soundFx';
import {
  DumbbellIcon,
  CalendarIcon,
  QrCodeIcon,
  UsersIcon,
  ActivityIcon,
  TrophyIcon,
  Volume2Icon,
  VolumeXIcon,
  LogOutIcon,
  ZapIcon,
  UserIcon
} from './utils/icons';

// Determine initial app mode from localStorage
function getInitialMode() {
  const managerToken = localStorage.getItem('managerToken');
  if (managerToken) return 'manager-app';
  const memberToken = localStorage.getItem('token');
  if (memberToken) return 'member-app';
  return 'member-auth';
}

const memberNavTabs = [
  { id: 'dashboard',  label: 'Dashboard',        icon: ActivityIcon },
  { id: 'classes',    label: 'Classes & Booking', icon: CalendarIcon },
  { id: 'bookings',   label: 'My Bookings',       icon: QrCodeIcon },
  { id: 'attendance', label: 'Check-in',          icon: ZapIcon },
  { id: 'trainers',   label: 'Trainers',          icon: UsersIcon },
  { id: 'metrics',    label: 'Metrics & Timer',   icon: TrophyIcon }
];

function App() {
  // appMode: 'member-auth' | 'manager-auth' | 'register' | 'member-app' | 'manager-app'
  const [appMode, setAppMode] = useState(getInitialMode);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [toastMessage, setToastMessage] = useState(null);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(prev => prev === msg ? null : prev), 3500);
  };

  const handleMemberLogout = () => {
    sound.playClick();
    localStorage.removeItem('token');
    localStorage.removeItem('gym_user');
    setAppMode('member-auth');
    setCurrentTab('dashboard');
    showToast('Signed out successfully.');
  };

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
    if (!next) sound.playClick();
  };

  // ─── Auth Screens ────────────────────────────────────────────────────────────

  if (appMode === 'register') {
    return (
      <Register
        onNavigateLogin={() => setAppMode('member-auth')}
      />
    );
  }

  if (appMode === 'member-auth') {
    return (
      <Login
        onLoginSuccess={(newToken, isLive) => {
          localStorage.setItem('token', newToken);
          setCurrentTab('dashboard');
          setAppMode('member-app');
          showToast('Welcome back! Signed in to Member Portal.');
        }}
        onNavigateRegister={() => setAppMode('register')}
        onNavigateManager={() => setAppMode('manager-auth')}
      />
    );
  }

  if (appMode === 'manager-auth') {
    return (
      <ManagerLogin
        onLoginSuccess={(managerToken, managerId) => {
          setCurrentTab('overview');
          setAppMode('manager-app');
          showToast('Welcome! Signed in to Manager Portal.');
        }}
        onBackToMember={() => setAppMode('member-auth')}
      />
    );
  }

  // ─── Manager App ─────────────────────────────────────────────────────────────

  if (appMode === 'manager-app') {
    return (
      <ManagerDashboard
        onLogout={() => {
          setAppMode('member-auth');
          showToast('Manager signed out.');
        }}
      />
    );
  }

  // ─── Member App ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-[#111827] border border-emerald-700/60 shadow-xl px-4 py-3 rounded-lg text-slate-200 text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#111827] border-b border-slate-800/90 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              onClick={() => { sound.playClick(); setCurrentTab('dashboard'); }}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow">
                <DumbbellIcon size={18} color="#ffffff" />
              </div>
              <div>
                <span className="font-bold text-base text-white tracking-tight block leading-none">
                  Optimus Prime Systems
                </span>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  Member Portal
                </span>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border bg-emerald-950/40 text-emerald-400 border-emerald-800/60">
                <UserIcon size={12} color="#34d399" />
                <span>Member</span>
              </span>

              <span className="hidden md:inline text-xs text-slate-400 font-medium border-l border-slate-800 pl-3">
                {currentTime}
              </span>

              <button
                onClick={toggleSound}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeXIcon size={16} color="#64748b" /> : <Volume2Icon size={16} color="#10b981" />}
              </button>

              <button
                onClick={handleMemberLogout}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-red-400 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <LogOutIcon size={14} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Tab Nav */}
          <nav className="flex items-center gap-1 border-t border-slate-800/60 overflow-x-auto no-scrollbar py-1">
            {memberNavTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { sound.playClick(); setCurrentTab(tab.id); }}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold border-b-2 border-emerald-500'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={15} color={isActive ? '#10b981' : '#64748b'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {currentTab === 'dashboard' && (
          <Dashboard
            role="member"
            onNavigateTab={(tab) => { sound.playClick(); setCurrentTab(tab); }}
            onTriggerCheckIn={() => setCurrentTab('attendance')}
          />
        )}
        {currentTab === 'classes' && (
          <ClassesPage role="member" onShowToast={showToast} />
        )}
        {currentTab === 'bookings' && (
          <MemberBookings
            onNavigateClasses={() => setCurrentTab('classes')}
            onShowToast={showToast}
          />
        )}
        {currentTab === 'attendance' && (
          <AttendanceCheckin onShowToast={showToast} />
        )}
        {currentTab === 'trainers' && (
          <TrainersPage role="member" onShowToast={showToast} />
        )}
        {currentTab === 'metrics' && (
          <BodyMetrics onShowToast={showToast} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#111827] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Optimus Prime Systems.</p>
          <p className="font-mono text-[11px] text-slate-500">Member Portal • System Active</p>
        </div>
      </footer>
    </div>
  );
}

export default App;