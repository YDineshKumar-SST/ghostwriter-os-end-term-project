import React, { useState, useCallback, useMemo } from 'react';
import { usePersona } from '../context/PersonaContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { generateVlogDescription } from '../services/aiService';
import { Video, Plus, Edit, Trash, Sparkles, Youtube, Clock, Tag, TrendingUp } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

const initialVlogs = [
  {
    id: 1,
    title: 'AI Tools That Will Change 2026',
    platform: 'YouTube',
    status: 'Published',
    description: 'A deep dive into the most impactful AI tools for developers.',
    duration: '12:34',
    views: 15420,
    personaId: 1,
    date: '2026-04-05',
    tags: ['AI', 'Productivity', 'Tech'],
  },
  {
    id: 2,
    title: 'Building a React App from Scratch',
    platform: 'YouTube',
    status: 'Draft',
    description: 'Step-by-step tutorial for beginners.',
    duration: '18:22',
    views: 0,
    personaId: 2,
    date: '2026-04-10',
    tags: ['React', 'Tutorial', 'Web Dev'],
  },
  {
    id: 3,
    title: 'Ethics in AI Development',
    platform: 'YouTube',
    status: 'Draft',
    description: 'Discussion on responsible AI practices.',
    duration: '15:00',
    views: 0,
    personaId: 3,
    date: '2026-04-12',
    tags: ['AI Ethics', 'Technology'],
  },
];

const Vlogs = () => {
  const { personas, currentPersona } = usePersona();
  const { user } = useAuth();
  const [vlogs, setVlogs] = useState(initialVlogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVlog, setEditingVlog] = useState(null);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [generatedVlog, setGeneratedVlog] = useState(null);

  const filteredVlogs = useMemo(
    () => vlogs.filter((vlog) => vlog.personaId === currentPersona.id),
    [vlogs, currentPersona.id],
  );

  const handleAddVlog = useCallback(
    async (newVlog) => {
      const vlog = {
        ...newVlog,
        id: Date.now(),
        personaId: currentPersona.id,
      };
      setVlogs((current) => [...current, vlog]);
      setIsModalOpen(false);

      if (user) {
        await supabase.from('vlogs').insert([
          {
            title: vlog.title,
            platform: vlog.platform,
            status: vlog.status,
            description: vlog.description,
            duration: vlog.duration,
            tags: vlog.tags,
            personaId: vlog.personaId,
            user_id: user.id,
          },
        ]);
      }
    },
    [currentPersona.id, user],
  );

  const handleEditVlog = useCallback(
    async (updatedVlog) => {
      setVlogs((current) =>
        current.map((vlog) => (vlog.id === updatedVlog.id ? updatedVlog : vlog)),
      );
      setEditingVlog(null);
      setIsModalOpen(false);

      if (user && updatedVlog.id) {
        await supabase
          .from('vlogs')
          .update({
            title: updatedVlog.title,
            platform: updatedVlog.platform,
            status: updatedVlog.status,
            description: updatedVlog.description,
            duration: updatedVlog.duration,
            tags: updatedVlog.tags,
          })
          .eq('id', updatedVlog.id);
      }
    },
    [user],
  );

  const handleDeleteVlog = useCallback(
    async (id) => {
      setVlogs((current) => current.filter((vlog) => vlog.id !== id));
      if (user) {
        await supabase.from('vlogs').delete().eq('id', id);
      }
    },
    [user],
  );

  const handleGenerateVlog = async () => {
    if (!aiTopic.trim()) return;
    setGeneratingAI(true);
    try {
      const result = await generateVlogDescription(aiTopic, currentPersona);
      setGeneratedVlog(result);
    } catch (error) {
      alert(error.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handlePublishGeneratedVlog = () => {
    if (!generatedVlog) return;
    const newVlog = {
      title: generatedVlog.title,
      platform: 'YouTube',
      status: 'Draft',
      description: generatedVlog.description,
      duration: generatedVlog.recommendedLength,
      tags: generatedVlog.tags,
    };
    handleAddVlog(newVlog);
    setAiTopic('');
    setGeneratedVlog(null);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-7 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky-400">Video Content Management</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Vlogs & Videos</h2>
            <p className="mt-2 text-slate-400">
              Manage video content for {currentPersona.name} • {currentPersona.niche}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            <Plus className="h-4 w-4" />
            Add Vlog
          </button>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-6 w-6 text-sky-400" />
          <h2 className="text-xl font-semibold text-white">AI Vlog Generator</h2>
        </div>
        <p className="text-slate-400 mb-6">
          Generate AI-powered vlog outlines, descriptions, and talking points for your videos.
        </p>
        <div className="space-y-4">
          <input
            type="text"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            placeholder="Enter your video topic..."
            className="w-full rounded-3xl border border-slate-800/80 bg-slate-900/80 px-4 py-3 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
          />
          <button
            onClick={handleGenerateVlog}
            disabled={generatingAI || !aiTopic.trim()}
            className="rounded-3xl bg-purple-500 px-6 py-3 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingAI ? 'Generating...' : 'Generate Vlog Outline'}
          </button>

          {generatedVlog && (
            <div className="mt-6 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{generatedVlog.title}</h3>
              <p className="text-slate-300 mb-4">{generatedVlog.description}</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-800/50 p-4">
                  <div className="flex items-center gap-2 text-sky-400 mb-2">
                    <Tag className="h-4 w-4" />
                    <span className="text-sm font-medium">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generatedVlog.tags?.map((tag, i) => (
                      <span key={i} className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-800/50 p-4">
                  <div className="flex items-center gap-2 text-sky-400 mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Recommended Length</span>
                  </div>
                  <p className="text-slate-300">{generatedVlog.recommendedLength}</p>
                </div>
              </div>

              {generatedVlog.talkingPoints && generatedVlog.talkingPoints.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-sky-400 mb-2">Talking Points</h4>
                  <ul className="space-y-2">
                    {generatedVlog.talkingPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="text-sky-400 mt-1">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={handlePublishGeneratedVlog}
                className="mt-4 rounded-3xl bg-green-500 px-6 py-3 text-white hover:bg-green-600"
              >
                Add to Vlogs
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
        <h3 className="text-xl font-semibold text-white mb-6">Your Vlogs</h3>
        {filteredVlogs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/80 p-8 text-center text-slate-400">
            No vlogs yet. Create your first video content above!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredVlogs.map((vlog) => (
              <article
                key={vlog.id}
                className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-sky-400/30"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <Youtube className="h-5 w-5" />
                    <span className="text-sm font-medium">{vlog.platform}</span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      vlog.status === 'Published'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-slate-700/80 text-slate-300'
                    }`}
                  >
                    {vlog.status}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{vlog.title}</h4>
                <p className="text-sm text-slate-400 mb-3">{vlog.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {vlog.duration}
                  </span>
                  {vlog.views > 0 && (
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {vlog.views.toLocaleString()} views
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {vlog.tags?.slice(0, 3).map((tag, i) => (
                    <span key={i} className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingVlog(vlog);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-400/60"
                  >
                    <Edit className="h-4 w-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVlog(vlog.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-sm text-rose-300 transition hover:border-rose-400/60"
                  >
                    <Trash className="h-4 w-4" /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && (
        <VlogModal
          vlog={editingVlog}
          onClose={() => {
            setIsModalOpen(false);
            setEditingVlog(null);
          }}
          onSave={editingVlog ? handleEditVlog : handleAddVlog}
        />
      )}
    </div>
  );
};

const VlogModal = ({ vlog, onClose, onSave }) => {
  const [title, setTitle] = useState(vlog?.title || '');
  const [platform, setPlatform] = useState(vlog?.platform || 'YouTube');
  const [status, setStatus] = useState(vlog?.status || 'Draft');
  const [description, setDescription] = useState(vlog?.description || '');
  const [duration, setDuration] = useState(vlog?.duration || '');
  const [tags, setTags] = useState(vlog?.tags?.join(', ') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...vlog,
      title,
      platform,
      status,
      description,
      duration,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      date: vlog?.date || new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-950 p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-white">{vlog ? 'Edit Vlog' : 'Add New Vlog'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
            >
              <option value="YouTube">YouTube</option>
              <option value="TikTok">TikTok</option>
              <option value="Instagram Reels">Instagram Reels</option>
              <option value="LinkedIn Video">LinkedIn Video</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="10:30"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="AI, Tech, Tutorial"
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-slate-700 px-6 py-2 text-white hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-sky-500 px-6 py-2 text-white hover:bg-sky-400"
            >
              {vlog ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Vlogs;