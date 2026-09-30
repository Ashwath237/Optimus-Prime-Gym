import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../utils/soundFx';
import { QrCodeIcon, CalendarIcon, ClockIcon, TrashIcon } from '../utils/icons';

function MemberBookings({ onNavigateClasses, onShowToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await api.getBookings();
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = async (id, className) => {
    sound.playClick();
    if (!window.confirm(`Cancel reservation for "${className || 'Class'}"?`)) return;

    setCancellingId(id);
    try {
      await api.cancelBooking(id);
      sound.playClick();
      setBookings(prev => prev.filter(b => b.id !== id));
      if (onShowToast) onShowToast(`Reservation cancelled.`);
    } catch (err) {
      alert('Cancel error: ' + err.message);
    } finally {
      setCancellingId(null);
    }
  };

  const handlePassTap = () => {
    sound.playTurnstile();
    if (onShowToast) onShowToast('Digital pass verified. Gate unlocked.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          My Bookings & Membership Pass
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          View your upcoming class reservations and digital access pass
        </p>
      </div>

      {/* Digital Membership Pass Card */}
      <div className="max-w-md mx-auto clean-card p-6 border-slate-800 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block font-mono">
              Active Member Pass
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">Ashwath</h2>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 font-mono">
            Active
          </span>
        </div>

        <div className="flex items-center justify-between py-6">
          <div className="space-y-1">
            <p className="text-xs text-slate-400">Membership Tier</p>
            <p className="text-sm font-semibold text-white">All-Access Premium</p>
            <p className="text-xs text-slate-400 mt-2">Pass ID</p>
            <p className="text-xs font-mono font-medium text-slate-300">OPTIMUS-PASS-9942</p>
          </div>

          <div 
            onClick={handlePassTap}
            title="Click to simulate tap at entrance"
            className="w-24 h-24 bg-white rounded-xl p-2 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-md"
          >
            <QrCodeIcon size={72} color="#0f172a" />
          </div>
        </div>

        <button
          onClick={handlePassTap}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer border border-slate-700"
        >
          Tap Pass at Turnstile
        </button>
      </div>

      {/* Booked Sessions List */}
      <div className="clean-card p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">
              Confirmed Reservations ({bookings.length})
            </h2>
            <p className="text-xs text-slate-400">Your upcoming scheduled classes</p>
          </div>

          {bookings.length > 0 && (
            <button
              onClick={() => {
                sound.playClick();
                if (onNavigateClasses) onNavigateClasses();
              }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
            >
              + Book Another Class
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400 text-sm">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-semibold text-white">No active bookings</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">You have not booked any classes yet.</p>
            <button
              onClick={() => {
                sound.playClick();
                if (onNavigateClasses) onNavigateClasses();
              }}
              className="btn-primary text-xs font-semibold cursor-pointer"
            >
              Browse Class Schedule
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center justify-center shrink-0">
                    <CalendarIcon size={18} color="#10b981" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {booking.class_name || `Class #${booking.class_id}`}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-slate-300">
                        <ClockIcon size={12} color="#94a3b8" />
                        {booking.time || '10:00 AM'}
                      </span>
                      <span>•</span>
                      <span>Date: {booking.booked_date}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400 text-[11px]">{booking.qr_code || 'APX-PASS-99'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCancel(booking.id, booking.class_name)}
                  disabled={cancellingId === booking.id}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-slate-800 transition-colors cursor-pointer self-end sm:self-center"
                >
                  <span className="flex items-center gap-1">
                    <TrashIcon size={13} />
                    {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Reservation'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberBookings;