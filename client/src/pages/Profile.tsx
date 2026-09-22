import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Skill, User } from '../types';
import * as userApi from '../api/user.api';
import { PageLoader } from '../components/common/LoadingSpinner';
import { User as UserIcon, MapPin, Link as LinkIcon, Briefcase, Plus, X, Edit3, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const EXPERIENCE_LEVELS = ['junior', 'mid', 'senior', 'lead'] as const;

const Profile = () => {
  const { user: authUser, setUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', bio: '', location: '', resumeUrl: '', experienceLevel: '' as any,
  });

  useEffect(() => {
    Promise.all([userApi.getMe(), userApi.getAllSkills()])
      .then(([profileRes, skillsRes]) => {
        const p = profileRes.data.data;
        setProfile(p);
        setAllSkills(skillsRes.data.data);
        setForm({
          name: p.name,
          bio: p.bio || '',
          location: p.location || '',
          resumeUrl: p.resumeUrl || '',
          experienceLevel: p.experienceLevel || '',
        });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userApi.updateMe(form);
      const updated = res.data.data;
      setProfile(updated);
      setUser(updated as any);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (skillId: string) => {
    try {
      const res = await userApi.addSkill(skillId);
      setProfile(res.data.data);
      toast.success('Skill added');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      const res = await userApi.removeSkill(skillId);
      setProfile(res.data.data);
      toast.success('Skill removed');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove skill');
    }
  };

  if (loading) return <PageLoader />;
  if (!profile) return null;

  const availableSkills = allSkills.filter(s => !profile.skills.some(ps => ps.id === s.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">My Profile</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-secondary">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar + basic info */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-xl">
              {profile.name[0].toUpperCase()}
            </div>
            {!editing ? (
              <>
                <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                <p className="text-gray-400 text-sm mt-1">{authUser?.email}</p>
                {profile.location && (
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-400 mt-2">
                    <MapPin className="w-3.5 h-3.5" /> {profile.location}
                  </div>
                )}
                {profile.experienceLevel && (
                  <span className="badge-blue mt-3 inline-block capitalize">{profile.experienceLevel} level</span>
                )}
                {profile.resumeUrl && (
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 mt-3 transition-colors">
                    <LinkIcon className="w-3.5 h-3.5" /> View Resume
                  </a>
                )}
                {profile.role === 'admin' && (
                  <span className="badge bg-purple-900/50 text-purple-300 border border-purple-800 mt-3 inline-block">Admin</span>
                )}
              </>
            ) : (
              <div className="space-y-3 text-left">
                <div>
                  <label className="label">Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="label">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-field pl-9" placeholder="City, State" />
                  </div>
                </div>
                <div>
                  <label className="label">Experience Level</label>
                  <select value={form.experienceLevel} onChange={e => setForm({...form, experienceLevel: e.target.value as any})} className="input-field">
                    <option value="">Select level</option>
                    {EXPERIENCE_LEVELS.map(l => <option key={l} value={l} className="capitalize">{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Resume URL</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="url" value={form.resumeUrl} onChange={e => setForm({...form, resumeUrl: e.target.value})} className="input-field pl-9" placeholder="https://..." />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bio + Skills */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-brand-400" /> About
            </h3>
            {!editing ? (
              <p className="text-gray-300 leading-relaxed">
                {profile.bio || <span className="text-gray-500 italic">No bio yet. Click Edit Profile to add one.</span>}
              </p>
            ) : (
              <textarea
                value={form.bio}
                onChange={e => setForm({...form, bio: e.target.value})}
                rows={4}
                placeholder="Tell employers about yourself..."
                className="input-field resize-none"
                maxLength={2000}
              />
            )}
          </div>

          <div className="card">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-400" /> Skills
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map(skill => (
                <span key={skill.id} className="flex items-center gap-1.5 badge-blue pr-1.5">
                  {skill.name}
                  <button
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {profile.skills.length === 0 && (
                <p className="text-gray-500 text-sm italic">No skills added yet</p>
              )}
            </div>

            {availableSkills.length > 0 && (
              <div>
                <p className="text-sm text-gray-400 mb-2">Add skills:</p>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map(skill => (
                    <button
                      key={skill.id}
                      onClick={() => handleAddSkill(skill.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-gray-400 border border-surface-500 hover:border-brand-500 hover:text-brand-400 transition-all"
                    >
                      <Plus className="w-3 h-3" /> {skill.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
