import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../utils/soundFx';
import { ClockIcon, PlusIcon, TrashIcon } from '../utils/icons';

function TrainersPage({ role = 'member', onShowToast }) {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  // New Trainer Form State
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [availability, setAvailability] = useState('Mon - Fri (07:00 - 15:00)');

  useEffect(() => {
    loadTrainers();
  }, []);

  async function loadTrainers() {
    setLoading(true);
    try {
      const res = await api.getTrainers();
      setTrainers(res.data.trainers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateTrainer = async (e) => {
    e.preventDefault();
    sound.playClick();
    try {
      await api.createTrainer({ name, specialization, availability });
      sound.playSuccess();
      if (onShowToast) onShowToast(`Coach ${name} added successfully.`);
      setShowAddModal(false);
      setName('');
      setSpecialization('');
      loadTrainers();
    } catch (err) {
      alert('Error creating trainer: ' + err.message);
    }
  };

  const handleDelete = async (id, trainerName) => {
    if (!window.confirm(`Remove trainer "${trainerName}"?`)) return;
    sound.playClick();
    try {
      await api.deleteTrainer(id);
      setTrainers(prev => prev.filter(t => t.id !== id));
      if (onShowToast) onShowToast(`Trainer "${trainerName}" removed.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookConsultation = (trainer) => {
    sound.playSuccess();
    setSelectedTrainer(null);
    if (onShowToast) {
      onShowToast(`Consultation request sent to ${trainer.name}.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Trainers & Coaching Staff
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Certified fitness instructors and personal training specialists
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
            <span>Add Trainer</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading trainers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="clean-card-hover p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0 border border-slate-700">
                    {(trainer.name || 'T')[0]}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-0.5">
                  {trainer.name}
                </h3>
                <span className="text-[11px] font-medium text-emerald-400 block mb-2 font-mono">
                  {trainer.badge || 'Certified Coach'}
                </span>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {trainer.specialization}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-xs text-slate-400">
                  <ClockIcon size={13} color="#94a3b8" />
                  <span className="truncate">{trainer.availability}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setSelectedTrainer(trainer)}
                  className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md text-xs font-medium transition-colors cursor-pointer text-center border border-slate-700"
                >
                  Book 1-on-1
                </button>

                {role === 'manager' && (
                  <button
                    onClick={() => handleDelete(trainer.id, trainer.name)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-slate-800 transition-colors cursor-pointer"
                    title="Remove Trainer"
                  >
                    <TrashIcon size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Consultation Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-xl p-6 max-w-md w-full border border-slate-800 shadow-2xl text-white">
            <h2 className="text-lg font-bold text-white mb-1">Book Consultation</h2>
            <p className="text-xs text-slate-400 mb-4">Request a session with {selectedTrainer.name}</p>

            <div className="p-4 rounded-lg bg-[#0b0f19] border border-slate-800 mb-5 space-y-1.5 text-xs">
              <p><span className="font-semibold text-slate-300">Specialization:</span> {selectedTrainer.specialization}</p>
              <p><span className="font-semibold text-slate-300">Working Hours:</span> {selectedTrainer.availability}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTrainer(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBookConsultation(selectedTrainer)}
                className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Trainer Modal (Manager Only) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-xl p-6 max-w-md w-full border border-slate-800 shadow-2xl text-white">
            <h2 className="text-lg font-bold text-white mb-1">Add New Trainer</h2>
            <p className="text-xs text-slate-400 mb-4">Add a new coach to the gym roster</p>

            <form onSubmit={handleCreateTrainer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Miller"
                  className="clean-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Strength, Mobility, Rehab"
                  className="clean-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Availability
                </label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="Mon - Fri (07:00 - 15:00)"
                  className="clean-input w-full"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Save Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainersPage;