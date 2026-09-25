import React, { useState, useEffect } from 'react';
import ClassesPage from './components/ClassesPage';
import TrainersPage from './components/TrainersPage';
import MembersPage from './components/MembersPage';
import AttendanceCheckin from './components/AttendanceCheckin';
import { sound } from './utils/soundFx';
import {
  ActivityIcon,
  CalendarIcon,
  UsersIcon,
  ZapIcon,
  ShieldIcon,
  LogOutIcon,
  DumbbellIcon,
  Volume2Icon,
  VolumeXIcon,
  UserIcon
} from './utils/icons';

const navTabs = [
  { id: 'overview', label: 'Club Overview', icon: ActivityIcon },
  { id: 'classes', label: 'Class Management', icon: CalendarIcon },
  { id: 'attendance', label: 'Attendance Log', icon: ZapIcon },
  { id: 'trainers', label: 'Trainers Roster', icon: UsersIcon },
  { id: 'members', label: 'Member Directory', icon: ShieldIcon }
];

function StatCard({ label, value, sub }) {
  return (
    <div className="clean-card p-5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

function ClubOverview({ managerToken }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/manager/dashboard', {
          headers: { 'Authorization': `Bearer ${managerToken}` }
        });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError('Could not load live stats — backend may be offline.');
        // Fallback mock stats
        setStats({ totalMembers: 48, totalClasses: 12, totalBookings: 187, totalAttendance: 312 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [managerToken]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Club Overview</h2>
        <p className="text-xs text-slate-400 mt-0.5">Live stats from your gym database</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-700/40 text-amber-300 text-xs">
          {error} Showing fallback data.
        </div>
      )}

      {loading ? (
        <div className="text-slate-400 text-sm">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Members" value={stats?.totalMembers} sub="Active memberships" />
          <StatCard label="Total Classes" value={stats?.totalClasses} sub="Scheduled sessions" />
          <StatCard label="Total Bookings" value={stats?.totalBookings} sub="All time" />
          <StatCard label="Attendance Records" value={stats?.totalAttendance} sub="Check-ins logged" />
        </div>
      )}
    </div>
  );
}

function ManagerDashboard({ onLogout }) {
  const [currentTab, setCurrentTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [toastMessage, setToastMessage] = useState(null);
  const managerToken = localStorage.getItem('managerToken');

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

  const handleLogout = () => {
    sound.playClick();
    localStorage.removeItem('managerToken');
    localStorage.removeItem('managerId');
    if (onLogout) onLogout();
  };

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
    if (!next) sound.playClick();
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'overview':  return <ClubOverview managerToken={managerToken} />;
      case 'classes':   return <ClassesPage role="manager" showToast={showToast} />;
      case 'attendance':return <AttendanceCheckin role="manager" showToast={showToast} />;
      case 'trainers':  return <TrainersPage role="manager" showToast={showToast} />;
      case 'members':   return <MembersPage role="manager" showToast={showToast} />;
      default:          return <ClubOverview managerToken={managerToken} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#111827] border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-800">
              <DumbbellIcon size={16} color="#ffffff" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">Optimus Prime Systems</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldIcon size={10} color="#4ade80" />
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">Manager Portal</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-slate-500 tabular-nums">{currentTime}</span>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/60 border border-slate-700/50">
              <UserIcon size={11} color="#94a3b8" />
              <span className="text-xs text-slate-300 font-medium">Manager</span>
            </div>

            <button
              onClick={toggleSound}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeXIcon size={15} /> : <Volume2Icon size={15} />}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-red-400 hover:bg-red-950/30 border border-red-900/40 hover:border-red-800/60 transition-colors cursor-pointer"
            >
              <LogOutIcon size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-[#111827] border-b border-slate-800 px-4">
        <div className="max-w-7xl mx-auto flex gap-0.5 overflow-x-auto scrollbar-none">
          {navTabs.map(tab => {
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { sound.playClick(); setCurrentTab(tab.id); }}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  active
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon size={14} color={active ? '#4ade80' : '#94a3b8'} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-[#111827] border border-slate-700 shadow-xl text-xs text-slate-200 font-medium">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default ManagerDashboard;