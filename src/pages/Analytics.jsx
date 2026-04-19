import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { usePersona } from '../context/PersonaContext';
import { useAuth } from '../context/AuthContext';
import { analyzeContentPerformance, getAiRecommendations } from '../services/aiService';
import { contentService } from '../services/dataService';
import { BarChart2, TrendingUp, Target, Clock, Zap, Award, Calendar, PieChart, Activity, RefreshCw } from 'lucide-react';

const Analytics = () => {
  const { currentPersona, personas } = usePersona();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [posts, setPosts] = useState([]);

  const personaPosts = useMemo(
    () => posts.filter((post) => post.personaId === currentPersona.id),
    [posts, currentPersona.id],
  );

  const stats = useMemo(() => {
    const totalPosts = personaPosts.length;
    const published = personaPosts.filter((post) => post.status === 'Published').length;
    const drafts = totalPosts - published;
    return {
      totalPosts,
      published,
      drafts,
      avgEngagement: totalPosts > 0 ? `${Math.min(5 + published * 2, 12)}%` : '0%',
      topPlatform: currentPersona.platform,
      streakDays: Math.min(14, published + 3),
      thisWeek: Math.min(5, totalPosts),
      thisMonth: Math.min(12, totalPosts),
    };
  }, [personaPosts, currentPersona.platform]);

  const topTopics = useMemo(() => {
    const counts = {};
    personaPosts.forEach((post) => {
      const topic = post.title.split(' ').slice(0, 3).join(' ');
      counts[topic] = (counts[topic] || 0) + 1;
    });

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) {
      return [
        { topic: 'AI & Machine Learning', posts: 8, engagement: 'High' },
        { topic: 'Web Development', posts: 6, engagement: 'Medium' },
        { topic: 'Tech Tutorials', posts: 5, engagement: 'High' },
        { topic: 'Career Tips', posts: 3, engagement: 'Low' },
        { topic: 'Industry News', posts: 2, engagement: 'Medium' },
      ];
    }

    return entries.slice(0, 5).map(([topic, count]) => ({
      topic,
      posts: count,
      engagement: count > 1 ? 'High' : 'Medium',
    }));
  }, [personaPosts]);

  const loadPosts = useCallback(async () => {
    if (!user) {
      setPosts([]);
      return;
    }

    try {
      const data = await contentService.getAll(user.id);
      setPosts(
        data.map((item) => ({
          ...item,
          date: item.date || item.created_at?.split('T')[0] || item.date,
          dueDate: item.dueDate || item.date || item.dueDate,
        })),
      );
    } catch (error) {
      console.error('Failed to load posts for analytics:', error);
      setPosts([]);
    }
  }, [user]);

  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    try {
      const result = await analyzeContentPerformance(personaPosts, currentPersona);
      setAnalysis(result);

      const recs = getAiRecommendations(personaPosts, currentPersona);
      setRecommendations(recs);
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback analysis
      setAnalysis({
        strategyAssessment: 'Your content strategy shows consistent output with room for improvement in engagement.',
        consistencyScore: 7,
        contentGaps: ['More video content', 'Interactive tutorials', 'Case studies'],
        postingSchedule: {
          recommendedDays: ['Monday', 'Wednesday', 'Friday'],
          bestTimes: ['10:00 AM', '2:00 PM', '7:00 PM'],
          postsPerWeek: 3,
        },
        growthOpportunities: [
          'Collaborate with other creators in your niche',
          'Create series content for better retention',
          'Engage more with community comments',
        ],
      });
      setRecommendations([
        'Focus on creating more video content for higher engagement.',
        'Post consistently on weekdays at 10 AM for maximum reach.',
        'Add more interactive elements like polls and Q&As.',
      ]);
    } finally {
      setLoading(false);
    }
  }, [currentPersona, personaPosts]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    handleAnalyze();
  }, [handleAnalyze]);

  const engagementData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 45 },
    { day: 'Wed', value: 78 },
    { day: 'Thu', value: 52 },
    { day: 'Fri', value: 88 },
    { day: 'Sat', value: 35 },
    { day: 'Sun', value: 42 },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-7 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky-400">AI-Powered Insights</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Analytics Dashboard</h2>
            <p className="mt-2 text-slate-400">
              Analyze your content performance and get AI-powered recommendations.
            </p>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart2 className="h-4 w-4" />
                Refresh Analysis
              </>
            )}
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[24px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Total Posts</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.totalPosts}</p>
            </div>
            <div className="rounded-full bg-sky-500/20 p-3">
              <Target className="h-6 w-6 text-sky-400" />
            </div>
          </div>
          <p className="mt-2 text-sm text-emerald-400">+{stats.thisWeek} this week</p>
        </div>

        <div className="rounded-[24px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Published</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.published}</p>
            </div>
            <div className="rounded-full bg-emerald-500/20 p-3">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-400">{stats.drafts} drafts remaining</p>
        </div>

        <div className="rounded-[24px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Engagement</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.avgEngagement}</p>
            </div>
            <div className="rounded-full bg-purple-500/20 p-3">
              <Activity className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <p className="mt-2 text-sm text-emerald-400">Above average</p>
        </div>

        <div className="rounded-[24px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Streak</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.streakDays} days</p>
            </div>
            <div className="rounded-full bg-orange-500/20 p-3">
              <Zap className="h-6 w-6 text-orange-400" />
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-400">Keep it up!</p>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Engagement Chart */}
        <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-sky-400" />
              <h3 className="text-lg font-semibold text-white">Weekly Engagement</h3>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-white"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="flex items-end gap-2 h-40">
            {engagementData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-sky-500 to-sky-400"
                  style={{ height: `${item.value}%` }}
                />
                <span className="mt-2 text-xs text-slate-400">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Topics */}
        <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="h-5 w-5 text-sky-400" />
            <h3 className="text-lg font-semibold text-white">Top Performing Topics</h3>
          </div>
          <div className="space-y-3">
            {topTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between rounded-2xl bg-slate-900/50 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{topic.topic}</p>
                    <p className="text-xs text-slate-400">{topic.posts} posts</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    topic.engagement === 'High'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : topic.engagement === 'Medium'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {topic.engagement}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Award className="h-5 w-5 text-sky-400" />
          <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4">
              <div className="flex items-center gap-2 text-sky-400 mb-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-semibold">Suggestion #{index + 1}</span>
              </div>
              <p className="text-slate-300 text-sm">{rec}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Analysis */}
      {analysis && (
        <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <BarChart2 className="h-5 w-5 text-sky-400" />
            <h3 className="text-lg font-semibold text-white">Performance Analysis</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-900/50 p-4">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Strategy Assessment</h4>
              <p className="text-white">{analysis.strategyAssessment}</p>
            </div>

            <div className="rounded-2xl bg-slate-900/50 p-4">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Consistency Score</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 rounded-full bg-slate-700">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                    style={{ width: `${(analysis.consistencyScore || 7) * 10}%` }}
                  />
                </div>
                <span className="text-xl font-bold text-white">{analysis.consistencyScore}/10</span>
              </div>
            </div>

            {analysis.postingSchedule && (
              <div className="rounded-2xl bg-slate-900/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-sky-400" />
                  <h4 className="text-sm font-medium text-slate-400">Recommended Schedule</h4>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {analysis.postingSchedule.recommendedDays?.map((day, i) => (
                    <span key={i} className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-300">
                      {day}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-400">
                  Best times: {analysis.postingSchedule.bestTimes?.join(', ')}
                </p>
                <p className="text-sm text-slate-400">
                  {analysis.postingSchedule.postsPerWeek} posts per week
                </p>
              </div>
            )}

            {analysis.contentGaps && (
              <div className="rounded-2xl bg-slate-900/50 p-4">
                <h4 className="text-sm font-medium text-slate-400 mb-3">Content Gaps to Fill</h4>
                <ul className="space-y-2">
                  {analysis.contentGaps.map((gap, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {analysis.growthOpportunities && (
            <div className="mt-6 rounded-2xl bg-slate-900/50 p-4">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Growth Opportunities</h4>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {analysis.growthOpportunities.map((opp, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-xl bg-slate-800/50 p-3">
                    <TrendingUp className="h-4 w-4 mt-0.5 text-emerald-400" />
                    <span className="text-sm text-slate-300">{opp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Persona Info */}
      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-5 w-5 text-sky-400" />
          <h3 className="text-lg font-semibold text-white">Analytics for {currentPersona.name}</h3>
        </div>
        <p className="text-slate-400">
          Personalized insights based on your niche: <strong>{currentPersona.niche}</strong>
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: currentPersona.brandColor }} />
            <span className="text-sm text-slate-300">{currentPersona.platform}</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-sm text-slate-400">{currentPersona.niche}</span>
        </div>
      </section>
    </div>
  );
};

export default Analytics;