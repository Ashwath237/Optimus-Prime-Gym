import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../utils/soundFx';
import { ClockIcon, PlusIcon, TrashIcon } from '../utils/icons';

function ClassesPage({ role = 'member', onShowToast }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [bookingClassId, setBookingClassId] = useState(null);

  // New Class Form State
  const [newClassName, setNewClassName] = useState('');
  const [newTrainerId, setNewTrainerId] = useState('1');
  const [newTime, setNewTime] = useState('07:00 AM');
  const [newCapacity, setNewCapacity] = useState(20);
  const [newDifficulty, setNewDifficulty] = useState('Intermediate');
  const [newCategory, setNewCategory] = useState('HIIT');

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    setLoading(true);
    try {
      const res = await api.getClasses();
      setClasses(res.data.classes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleBook = async (cls) => {
    sound.playClick();
    setBookingClassId(cls.id);
    try {
      const bookedDate = new Date().toISOString().split('T')[0];
      await api.createBooking({
        member_id: 1,
        class_id: cls.id,
        booked_date: bookedDate
      });

      sound.playSuccess();
      if (onShowToast) {
        onShowToast(`Class booked: ${cls.name} on ${bookedDate}`);
      }

      setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, booked_count: (c.booked_count || 0) + 1 } : c));
    } catch (err) {
      alert('Booking error: ' + err.message);
    } finally {
      setBookingClassId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete class "${name}"?`)) return;
    sound.playClick();
    try {
      await api.deleteClass(id);
      setClasses(prev => prev.filter(c => c.id !== id));
      if (onShowToast) onShowToast(`Class "${name}" deleted.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    sound.playClick();
    try {
      await api.createClass({
        name: newClassName,
        trainer_id: Number(newTrainerId),
        time: newTime,
        capacity: Number(newCapacity),
        difficulty_level: newDifficulty,
        category: newCategory
      });
      sound.playSuccess();
      if (onShowToast) onShowToast(`Class "${newClassName}" added successfully.`);
      setShowAddModal(false);
      setNewClassName('');
      loadClasses();
    } catch (err) {
      alert('Create class error: ' + err.message);
    }
  };

  const categories = ['All', 'HIIT', 'Strength', 'Yoga', 'Boxing', 'Spin', 'CrossFit'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredClasses = classes.filter((c) => {
    const matchesSearch = (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (c.trainer_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (c.category || 'HIIT') === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || c.difficulty_level === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {role === 'manager' ? 'Class Schedule & Session Management' : 'Class Schedule & Booking'}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {role === 'manager'
              ? 'Schedule, configure, and manage club group fitness classes'
              : 'Browse upcoming fitness sessions and reserve your spot'}
          </p>
        </div>

        {role === 'manager' && (
          <button
            onClick={() => {
              sound.playClick();
              setShowAddModal(true);
            }}
            className="btn-primary flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-sm w-fit"
          >
            <PlusIcon size={16} color="#ffffff" />
            <span>Add New Class</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="clean-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes or coaches (e.g. HIIT, Yoga)..."
            className="clean-input flex-1"
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Level:</span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  sound.playClick();
                  setSelectedDifficulty(diff);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'bg-[#0b0f19] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white font-semibold shadow-sm'
                  : 'bg-[#0b0f19] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading schedule...</div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center py-16 clean-card">
          <p className="text-sm font-semibold text-white">No classes found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => {
            const booked = cls.booked_count || 12;
            const capacity = cls.capacity || 20;
            const spotsLeft = Math.max(capacity - booked, 0);
            const isFull = spotsLeft === 0;

            return (
              <div key={cls.id} className="clean-card-hover p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#0b0f19] text-slate-300 border border-slate-800">
                      {cls.category || 'Fitness'}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {cls.difficulty_level}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">
                    {cls.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Coach: <span className="font-medium text-slate-200">{cls.trainer_name || `Trainer #${cls.trainer_id}`}</span>
                  </p>

                  <div className="space-y-2 py-3 border-t border-slate-800 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <ClockIcon size={14} color="#94a3b8" />
                        Time:
                      </span>
                      <span className="font-semibold text-white">{cls.time}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Capacity:</span>
                      <span className="font-semibold text-white">
                        {spotsLeft} spots available <span className="text-slate-500 font-normal">({capacity} total)</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => handleBook(cls)}
                    disabled={bookingClassId === cls.id || isFull}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isFull
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    {bookingClassId === cls.id ? 'Reserving...' : isFull ? 'Class Full' : 'Book Class'}
                  </button>

                  {role === 'manager' && (
                    <button
                      onClick={() => handleDelete(cls.id, cls.name)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-slate-800 transition-colors cursor-pointer"
                      title="Delete Class"
                    >
                      <TrashIcon size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Class Modal (Manager Only) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-xl p-6 max-w-md w-full border border-slate-800 shadow-2xl text-white">
            <h2 className="text-lg font-bold text-white mb-1">Create New Class</h2>
            <p className="text-xs text-slate-400 mb-4">Add a new class to the schedule</p>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. Strength & Conditioning"
                  className="clean-input w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="clean-input w-full"
                  >
                    <option value="HIIT">HIIT</option>
                    <option value="Strength">Strength</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Boxing">Boxing</option>
                    <option value="Spin">Spin</option>
                    <option value="CrossFit">CrossFit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="clean-input w-full"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="07:00 AM"
                    className="clean-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="clean-input w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assign Coach
                </label>
                <select
                  value={newTrainerId}
                  onChange={(e) => setNewTrainerId(e.target.value)}
                  className="clean-input w-full"
                >
                  <option value="1">Marcus Vance</option>
                  <option value="2">Elena Rostova</option>
                  <option value="3">Kai Chen</option>
                  <option value="4">Darius Hammer</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassesPage;