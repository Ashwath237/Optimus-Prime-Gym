import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { sound } from '../utils/soundFx';
import { PlusIcon, TrashIcon } from '../utils/icons';

function MembersPage({ onShowToast }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New member form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('24');
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);
    try {
      const res = await api.getMembers();
      setMembers(res.data.members || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateMember = async (e) => {
    e.preventDefault();
    sound.playClick();
    try {
      await api.createMember({
        username,
        email,
        age: Number(age),
        fitness_level: fitnessLevel
      });
      sound.playSuccess();
      if (onShowToast) onShowToast(`Member ${username} added successfully.`);
      setShowAddModal(false);
      setUsername('');
      setEmail('');
      loadMembers();
    } catch (err) {
      alert('Error creating member: ' + err.message);
    }
  };

  const handleDelete = async (id, memberName) => {
    if (!window.confirm(`Remove member "${memberName}"?`)) return;
    sound.playClick();
    try {
      await api.deleteMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
      if (onShowToast) onShowToast(`Member "${memberName}" removed.`);
    } catch (err) {
      console.error(err);
    }
  };

  const tiers = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredMembers = members.filter((m) => {
    const matchesSearch = (m.username || '').toLowerCase().includes(search.toLowerCase()) ||
                          (m.email || '').toLowerCase().includes(search.toLowerCase());
    const matchesTier = filterTier === 'All' || (m.fitness_level || '').toLowerCase() === filterTier.toLowerCase();
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Member Directory
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage enrolled gym members, membership tiers, and profiles
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowAddModal(true);
          }}
          className="btn-primary flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-sm w-fit"
        >
          <PlusIcon size={16} color="#ffffff" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="clean-card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="clean-input w-full sm:max-w-xs"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 font-medium">Level:</span>
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => {
                sound.playClick();
                setFilterTier(tier);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                filterTier === tier
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-[#0b0f19] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="clean-card p-6 border-slate-800">
        {loading ? (
          <div className="text-center py-8 text-slate-400 text-sm">Loading members...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">No members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-800 pb-2">
                  <th className="pb-3">Member Name</th>
                  <th className="pb-3">Fitness Level</th>
                  <th className="pb-3">Age</th>
                  <th className="pb-3">Enrolled Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-950/60 text-emerald-400 font-bold text-xs flex items-center justify-center uppercase border border-emerald-800/60">
                          {(member.username || `Member #${member.id}`)[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{member.username || `Member #${member.id}`}</p>
                          <p className="text-[11px] text-slate-400">{member.email || `member${member.id}@apex.gym`}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#0b0f19] text-slate-300 border border-slate-800 capitalize">
                        {member.fitness_level || 'Intermediate'}
                      </span>
                    </td>

                    <td className="py-3.5 text-slate-300 font-mono">
                      {member.age} yrs
                    </td>

                    <td className="py-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {member.registration_date ? String(member.registration_date).split('T')[0] : '2026-01-10'}
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(member.id, member.username)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-slate-800 transition-colors cursor-pointer"
                        title="Remove Member"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-xl p-6 max-w-md w-full border border-slate-800 shadow-2xl text-white">
            <h2 className="text-lg font-bold text-white mb-1">Add New Member</h2>
            <p className="text-xs text-slate-400 mb-4">Register a member to the database</p>

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name / Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="clean-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="clean-input w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="clean-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Fitness Level
                  </label>
                  <select
                    value={fitnessLevel}
                    onChange={(e) => setFitnessLevel(e.target.value)}
                    className="clean-input w-full"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
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
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MembersPage;
