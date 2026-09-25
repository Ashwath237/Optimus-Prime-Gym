import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../utils/soundFx';
import { QrCodeIcon, CheckCircleIcon } from '../utils/icons';

function AttendanceCheckin({ onShowToast }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [lastCheckin, setLastCheckin] = useState(null);

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    setLoading(true);
    try {
      const res = await api.getAttendance();
      setAttendance(res.data.attendance || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleInstantCheckIn = async () => {
    sound.playClick();
    setCheckingIn(true);

    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toISOString().split('T')[0];

      await api.checkIn({
        member_id: 1,
        member_name: 'Ashwath',
        class_id: 1,
        class_name: 'Gym Floor & Free Weights',
        attended_date: dateStr,
        check_in_time: timeStr
      });

      sound.playTurnstile();
      setLastCheckin({
        time: timeStr,
        date: dateStr
      });

      if (onShowToast) {
        onShowToast(`Check-in recorded at ${timeStr}`);
      }

      loadAttendance();
    } catch (err) {
      alert('Check-in error: ' + err.message);
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Facility Check-in & Attendance
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Record your arrival and review today's member attendance log
        </p>
      </div>

      {/* Check-In Action Card */}
      <div className="clean-card p-6 sm:p-8 max-w-xl mx-auto border-slate-800">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center shrink-0">
            <QrCodeIcon size={44} color="#10b981" />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <h2 className="text-lg font-bold text-white">
              Front Desk / Turnstile Check-In
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log your workout session or group class attendance. Your entry will be timestamped and saved to the attendance records.
            </p>

            <div className="pt-2">
              <button
                onClick={handleInstantCheckIn}
                disabled={checkingIn}
                className="btn-primary w-full sm:w-auto px-6 py-2.5 text-xs font-semibold cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircleIcon size={16} color="#ffffff" />
                <span>{checkingIn ? 'Recording check-in...' : 'Check In Now'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Success confirmation */}
        {lastCheckin && (
          <div className="mt-6 p-4 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3">
            <CheckCircleIcon size={20} color="#10b981" />
            <div className="text-xs">
              <p className="font-semibold text-emerald-300">Check-in confirmed</p>
              <p className="text-emerald-400/80">Timestamp: {lastCheckin.time} • Date: {lastCheckin.date}</p>
            </div>
          </div>
        )}
      </div>

      {/* Attendance History Table */}
      <div className="clean-card p-6 border-slate-800">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">
              Attendance Records ({attendance.length})
            </h2>
            <p className="text-xs text-slate-400">History of verified member entries</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-6 text-slate-400 text-sm">Loading attendance logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-800 pb-2">
                  <th className="pb-3">Member Name</th>
                  <th className="pb-3">Area / Session</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Check-in Time</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {attendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-medium text-white">
                      {rec.member_name || `Member #${rec.member_id}`}
                    </td>
                    <td className="py-3 text-slate-300">
                      {rec.class_name || 'Gym Floor Entry'}
                    </td>
                    <td className="py-3 text-slate-400 whitespace-nowrap">
                      {rec.attended_date}
                    </td>
                    <td className="py-3 font-medium text-emerald-400">
                      {rec.check_in_time}
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/60">
                        {rec.status || 'Verified'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceCheckin;