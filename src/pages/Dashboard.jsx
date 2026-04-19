import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePersona } from '../context/PersonaContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { getAiRecommendations, generateBlogPost, generateComments } from '../services/aiService';
import { Plus, Edit, Trash, LayoutGrid, ListChecks, Search, Sparkles } from 'lucide-react';
import QuickAddModal from '../components/QuickAddModal';
import PersonaStats from '../components/PersonaStats';
import useLocalStorage from '../hooks/useLocalStorage';

const initialPosts = [
  {
    id: 1,
    title: 'Intro to AI',
    platform: 'Hashnode',
    status: 'Draft',
    description: 'Draft the first article for the AI learning series.',
    date: '2026-04-03',
    dueDate: '2026-05-05',
    priority: 'High',
    personaId: 1,
  },
  {
    id: 2,
    title: 'Deployment Patterns',
    platform: 'Dev.to',
    status: 'Published',
    description: 'A deep-dive on CI/CD for modern apps.',
    date: '2026-04-07',
    dueDate: '2026-04-07',
    priority: 'Medium',
    personaId: 2,
  },
  {
    id: 3,
    title: 'AI Ethics 101',
    platform: 'Medium',
    status: 'Draft',
    description: 'Outline ethical frameworks for responsible AI.',
    date: '2026-04-10',
    dueDate: '2026-05-12',
    priority: 'High',
    personaId: 3,
  },
  {
    id: 4,
    title: 'CLI Productivity',
    platform: 'Hashnode',
    status: 'Published',
    description: 'Tips for building fast command-line experiences.',
    date: '2026-04-12',
    dueDate: '2026-04-12',
    priority: 'Low',
    personaId: 4,
  },
  {
    id: 5,
    title: 'Emerging Tech Trends',
    platform: 'Dev.to',
    status: 'Draft',
    description: 'Capture the next wave of cross-platform tools.',
    date: '2026-04-14',
    dueDate: '2026-05-15',
    priority: 'Medium',
    personaId: 5,
  },
  {
    id: 6,
    title: 'Persona Launch Plan',
    platform: 'Hashnode',
    status: 'Published',
    description: 'Publish schedule and launch checklist.',
    date: '2026-04-16',
    dueDate: '2026-04-16',
    priority: 'Medium',
    personaId: 1,
  },
  {
    id: 7,
    title: 'Framework Comparison',
    platform: 'Medium',
    status: 'Published',
    description: 'Compare modern frontend frameworks for scale.',
    date: '2026-04-17',
    dueDate: '2026-04-17',
    priority: 'Low',
    personaId: 3,
  },
];

const Dashboard = () => {
  const { personas, currentPersona, switchPersona } = usePersona();
  const { user } = useAuth();
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [layout, setLayout] = useLocalStorage('layout', 'list');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotes, setAiNotes] = useState([]);
  const [topicQueue, setTopicQueue] = useState([]);
  const [blogTopic, setBlogTopic] = useState('');
  const [generatedBlog, setGeneratedBlog] = useState('');
  const [generatingBlog, setGeneratingBlog] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setTopicQueue([]);
  }, [currentPersona.id]);

  const filteredPosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          post.personaId === currentPersona.id &&
          post.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [posts, currentPersona.id, search],
  );

  const currentPosts = useMemo(
    () => posts.filter((post) => post.personaId === currentPersona.id),
    [posts, currentPersona.id],
  );

  const getAiTopicSuggestion = useCallback((persona, posts, existingTopics = []) => {
    const personaPosts = posts.filter((post) => post.personaId === persona.id);
    const publishedCount = personaPosts.filter((post) => post.status === 'Published').length;
    const niche = persona.niche || 'content';
    const platform = persona.platform || 'platform';

    const candidates = [
      `How to launch your first ${niche} story on ${platform}`,
      `How to make your ${platform} ${niche} posts more engaging`,
      `Advanced ${niche} growth tactics for ${platform}`,
      `A fresh ${niche} content series idea for ${platform}`,
      `How to turn your ${platform} drafts into a strong ${niche} narrative`,
      `5 ways to boost ${niche} engagement on ${platform}`,
      `A persona-led ${niche} campaign idea for ${platform}`,
    ];

    const available = candidates.filter((topic) => !existingTopics.includes(topic));
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
  }, []);

  const refreshAiNotes = useCallback(() => {
    setAiLoading(true);
    const recommendations = getAiRecommendations(posts, currentPersona);

    window.setTimeout(() => {
      setAiNotes(recommendations);
      
      setTopicQueue((currentQueue) => {
        const newTopic = getAiTopicSuggestion(currentPersona, posts, currentQueue);
        setBlogTopic(newTopic);
        setGeneratedBlog('');
        return [...currentQueue, newTopic];
      });
      
      setAiLoading(false);
    }, 220);
  }, [posts, currentPersona, getAiTopicSuggestion]);

  useEffect(() => {
    // Initialize recommendation on persona change
    const recommendations = getAiRecommendations(posts, currentPersona);
    setAiNotes(recommendations);
    setTopicQueue([]);
  }, [currentPersona.id]);

  const loadPosts = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data?.length) {
      setPosts(
        data.map((item) => ({
          ...item,
          date: item.date || item.created_at?.split('T')[0] || item.date,
          dueDate: item.dueDate || item.date || item.dueDate,
        })),
      );
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleAddPost = useCallback(
    async (newPost) => {
      const post = {
        ...newPost,
        id: Date.now(),
        personaId: currentPersona.id,
      };

      setPosts((current) => [...current, post]);
      setIsModalOpen(false);

      if (user) {
        await supabase.from('content_items').insert([
          {
            title: post.title,
            platform: post.platform,
            status: post.status,
            description: post.description,
            date: post.date,
            dueDate: post.dueDate,
            priority: post.priority,
            personaId: post.personaId,
            user_id: user.id,
          },
        ]);
      }
    },
    [currentPersona.id, user],
  );

  const handleEditPost = useCallback(
    async (updatedPost) => {
      setPosts((current) => current.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
      setEditingPost(null);
      setIsModalOpen(false);

      if (user && updatedPost.id) {
        await supabase
          .from('content_items')
          .update({
            title: updatedPost.title,
            platform: updatedPost.platform,
            status: updatedPost.status,
            description: updatedPost.description,
            date: updatedPost.date,
            dueDate: updatedPost.dueDate,
            priority: updatedPost.priority,
          })
          .eq('id', updatedPost.id);
      }
    },
    [user],
  );

  const handleGenerateBlog = async () => {
    if (!blogTopic.trim()) return;
    setGeneratingBlog(true);
    try {
      const blog = await generateBlogPost(blogTopic, currentPersona);
      setGeneratedBlog(blog);
    } catch (error) {
      alert(error.message);
    } finally {
      setGeneratingBlog(false);
    }
  };

  const handlePublishBlog = () => {
    if (!generatedBlog) return;
    const newPost = {
      title: blogTopic,
      platform: currentPersona.platform,
      status: 'Draft',
      description: generatedBlog.substring(0, 200) + '...',
      date: new Date().toISOString().split('T')[0],
      dueDate: null,
      priority: 'Medium',
    };
    handleAddPost(newPost);
    setBlogTopic('');
    setGeneratedBlog('');
  };

  const handleGenerateComments = async (post) => {
    try {
      const comments = await generateComments(post.description);
      alert(`Generated Comments:\n\n${comments.join('\n\n')}`);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeletePost = useCallback(
    async (id) => {
      setPosts((current) => current.filter((post) => post.id !== id));

      if (user) {
        await supabase.from('content_items').delete().eq('id', id);
      }
    },
    [user],
  );

  const openEditModal = useCallback((post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  }, []);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-7 shadow-[0_24px_120px_rgba(15,23,42,0.35)] ring-1 ring-slate-800/60">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-sky-400">Persona workspace</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{currentPersona.name}</h2>
              <p className="mt-2 text-slate-400">Managing content for {currentPersona.platform} with a {currentPersona.niche} brand voice.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/80 px-5 py-3 text-sm text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: currentPersona.brandColor }} />
              {currentPersona.platform}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => switchPersona(persona.id)}
                className={`rounded-3xl border px-4 py-4 text-left transition ${
                  persona.id === currentPersona.id
                    ? 'border-sky-400/40 bg-sky-500/10 text-white shadow-[0_0_0_1px_rgba(56,189,248,0.25)]'
                    : 'border-slate-800/80 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{persona.name}</span>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: persona.brandColor }} />
                </div>
                <p className="mt-2 text-sm text-slate-400">{persona.platform}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-7 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-sky-400">AI completion assistant</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Actionable recommendations</h3>
            </div>
            <button
              type="button"
              onClick={refreshAiNotes}
              className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              {aiLoading ? 'Refreshing...' : 'Refresh AI plan'}
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {aiNotes.map((note, index) => (
              <div key={index} className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                <div className="flex items-center gap-2 text-sky-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-semibold text-white">AI recommendation</span>
                </div>
                <p className="mt-3 text-slate-400">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PersonaStats posts={posts} />

      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-6 w-6 text-sky-400" />
          <h2 className="text-xl font-semibold text-white">AI Blog Generator</h2>
        </div>
        <p className="text-slate-400 mb-6">Generate a complete blog post using AI based on your topic.</p>
        <div className="space-y-4">
          <input
            type="text"
            value={blogTopic}
            onChange={(e) => setBlogTopic(e.target.value)}
            placeholder="Enter blog topic..."
            className="w-full rounded-3xl border border-slate-800/80 bg-slate-900/80 px-4 py-3 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
          />
          <button
            onClick={handleGenerateBlog}
            disabled={generatingBlog || !blogTopic.trim()}
            className="rounded-3xl bg-sky-500 px-6 py-3 text-white hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingBlog ? 'Generating...' : 'Generate Blog'}
          </button>
          {generatedBlog && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Generated Blog Post</h3>
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-slate-300">{generatedBlog}</pre>
              </div>
              <button
                onClick={handlePublishBlog}
                className="mt-4 rounded-3xl bg-green-500 px-6 py-3 text-white hover:bg-green-600"
              >
                Publish as Draft
              </button>
            </div>
          )}

          {topicQueue.length > 0 && (
            <div className="mt-8 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-sky-400" />
                <h3 className="text-lg font-semibold text-white">Topic queue</h3>
              </div>
              <div className="mt-4 space-y-3">
                {topicQueue.map((topic, index) => (
                  <div key={`${topic}-${index}`} className="rounded-3xl bg-slate-950/80 p-4 text-slate-300">
                    <p className="text-sm text-slate-200">{topic}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/80 px-4 py-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search current persona drafts"
              className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setLayout('list')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                layout === 'list' ? 'bg-sky-500 text-white' : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ListChecks className="h-4 w-4" />
              List
            </button>
            <button
              type="button"
              onClick={() => setLayout('grid')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                layout === 'grid' ? 'bg-sky-500 text-white' : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              <Plus className="h-4 w-4" />
              Quick add
            </button>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/80 p-8 text-center text-slate-400">
            No drafts found for this persona yet. Use quick add to create a new one.
          </div>
        ) : layout === 'grid' ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <article key={post.id} className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-sky-400/30">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm uppercase tracking-[0.3em] text-sky-400">{post.platform}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${post.status === 'Published' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-700/80 text-slate-300'}`}>
                    {post.status}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{post.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{post.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                  <span className="rounded-full bg-slate-800/80 px-3 py-1">Priority: {post.priority}</span>
                  <span className="rounded-full bg-slate-800/80 px-3 py-1">Due: {post.dueDate}</span>
                </div>
                <div className="mt-6 flex gap-2">
                  <button onClick={() => openEditModal(post)} className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-400/60">
                    <Edit className="h-4 w-4" /> Edit
                  </button>
                  <button onClick={() => handleGenerateComments(post)} className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-sm text-purple-300 transition hover:border-purple-400/60">
                    <Sparkles className="h-4 w-4" /> AI Comments
                  </button>
                  <button onClick={() => handleDeletePost(post.id)} className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-sm text-rose-300 transition hover:border-rose-400/60">
                    <Trash className="h-4 w-4" /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/80">
            <table className="min-w-full border-separate border-spacing-0">
              <thead className="bg-slate-950/80 text-slate-400">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.24em]">Title</th>
                  <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.24em]">Platform</th>
                  <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.24em]">Status</th>
                  <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.24em]">Due</th>
                  <th className="p-4 text-center text-sm font-semibold uppercase tracking-[0.24em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="border-t border-slate-800/80 hover:bg-slate-900/70">
                    <td className="p-4 text-slate-100">{post.title}</td>
                    <td className="p-4 text-slate-300">{post.platform}</td>
                    <td className="p-4 text-slate-300">{post.status}</td>
                    <td className="p-4 text-slate-300">{post.dueDate}</td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button onClick={() => openEditModal(post)} className="rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-700">
                        <Edit className="inline-block h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeletePost(post.id)} className="rounded-full bg-rose-500/15 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/20">
                        <Trash className="inline-block h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isModalOpen && (
        <QuickAddModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingPost(null);
          }}
          onSave={editingPost ? handleEditPost : handleAddPost}
          post={editingPost}
        />
      )}
    </div>
  );
};

export default Dashboard;
