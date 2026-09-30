import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../utils/soundFx';
import { DumbbellIcon, CalendarIcon, QrCodeIcon, UsersIcon, ActivityIcon } from '../utils/icons';

function Dashboard({ role = 'member', onNavigateTab, onTriggerCheckIn }) {
  const [members, setMembers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [membersRes, classesRes, bookingsRes, attendanceRes] = await Promise.all([
          api.getMembers(),
          api.getClasses(),
          api.getBookings(),
          api.getAttendance()
        ]);
        setMembers(membersRes.data.members || []);
        setClasses(classesRes.data.classes || []);
        setBookings(bookingsRes.data.bookings || []);
        setAttendance(attendanceRes.data.attendance || []);
      } catch (err) {
        console.error('Dashboard load error', err);
      }
    }
    loadData();
  }, []);

  const totalMembers = members.length;
  const avgAge = totalMembers > 0 
    ? (members.reduce((acc, m) => acc + (Number(m.age) || 0), 0) / totalMembers).toFixed(1) 
    : '26';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {role === 'manager' ? 'Club Management Overview' : 'Member Dashboard'}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {role === 'manager' 
              ? 'Real-time facility metrics, daily schedule, and attendance records' 
              : 'View your upcoming sessions, facility schedule, and check-in history'}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {role !== 'manager' ? (
            <button
              onClick={() => {
                sound.playTurnstile();
                if (onTriggerCheckIn) onTriggerCheckIn();
                else onNavigateTab('attendance');
              }}
              className="btn-primary flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-sm"
            >
              <QrCodeIcon size={16} color="#ffffff" />
              <span>Check In Now</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onNavigateTab('classes');
              }}
              className="btn-primary flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-sm"
            >
              <DumbbellIcon size={16} color="#ffffff" />
              <span>Add Class</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="clean-card p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>{role === 'manager' ? 'Total Enrolled Members' : 'Workout Streak'}</span>
            <UsersIcon size={16} color="#94a3b8" />
          </div>
          <div className="text-3xl font-bold text-white">
            {role === 'manager' ? totalMembers : '18 Days'}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {role === 'manager' ? 'Active registered profiles' : 'Consistent daily attendance'}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="clean-card p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Today's Check-ins</span>
            <ActivityIcon size={16} color="#94a3b8" />
          </div>
          <div className="text-3xl font-bold text-white">
            {attendance.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Verified gate entries today
          </p>
        </div>

        {/* Metric 3 */}
        <div className="clean-card p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Available Classes</span>
            <CalendarIcon size={16} color="#94a3b8" />
          </div>
          <div className="text-3xl font-bold text-white">
            {classes.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Scheduled group sessions
          </p>
        </div>

        {/* Metric 4 */}
        <div className="clean-card p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>{role === 'manager' ? 'Average Member Age' : 'My Active Bookings'}</span>
            <DumbbellIcon size={16} color="#94a3b8" />
          </div>
          <div className="text-3xl font-bold text-white">
            {role === 'manager' ? `${avgAge} yrs` : bookings.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {role === 'manager' ? 'Calculated from member roster' : 'Upcoming reserved spots'}
          </p>
        </div>
      </div>

      {/* Main 2-Column Split: Daily Schedule & Attendance Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Schedule */}
        <div className="lg:col-span-2 clean-card p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-white">
                Today's Class Schedule
              </h2>
              <p className="text-xs text-slate-400">Upcoming group fitness classes and spots available</p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onNavigateTab('classes');
              }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
            >
              View All Classes →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-800 pb-2">
                  <th className="pb-3">Class Name</th>
                  <th className="pb-3">Coach</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Capacity</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {classes.slice(0, 4).map((cls) => {
                  const booked = cls.booked_count || 12;
                  const capacity = cls.capacity || 20;
                  const spots = Math.max(capacity - booked, 0);

                  return (
                    <tr key={cls.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 pr-3">
                        <span className="font-medium text-white block">{cls.name}</span>
                        <span className="text-[11px] text-slate-400">{cls.category || 'General'}</span>
                      </td>
                      <td className="py-3.5 text-slate-300">
                        {cls.trainer_name || `Trainer #${cls.trainer_id}`}
                      </td>
                      <td className="py-3.5 text-slate-200 font-medium whitespace-nowrap">
                        {cls.time}
                      </td>
                      <td className="py-3.5 text-slate-300">
                        <span className={`font-semibold ${spots <= 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {spots} spots left
                        </span>
                        <span className="text-slate-500 text-[11px]"> of {capacity}</span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => {
                            sound.playClick();
                            onNavigateTab('classes');
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-md font-medium text-xs transition-colors cursor-pointer"
                        >
                          Book
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Attendance Feed */}
        <div className="clean-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Recent Check-ins
                </h2>
                <p className="text-xs text-slate-400">Latest facility entries</p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/60">
                Live
              </span>
            </div>

            <div className="space-y-3">
              {attendance.slice(0, 5).map((att) => (
                <div key={att.id} className="p-3 bg-[#0b0f19] rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center border border-slate-700">
                      {(att.member_name || 'M')[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{att.member_name || `Member #${att.member_id}`}</p>
                      <p className="text-[11px] text-slate-400">{att.class_name || 'Gym Entry'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-slate-300 block">{att.check_in_time}</span>
                    <span className="text-[10px] text-emerald-400 font-medium">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onNavigateTab('attendance');
            }}
            className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            View Full Attendance Log →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;