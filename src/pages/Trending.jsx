import React, { useState, useCallback, useMemo } from 'react';
import { usePersona } from '../context/PersonaContext';
import { generateTrendingTopics, analyzeContentPerformance } from '../services/aiService';
import { Sparkles, TrendingUp, Target, Zap, Calendar, BarChart2, Lightbulb, RefreshCw } from 'lucide-react';

const Trending = () => {
  const { currentPersona, personas } = usePersona();
  const [loading, setLoading] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [performanceAnalysis, setPerformanceAnalysis] = useState(null);
  const [selectedNiche, setSelectedNiche] = useState(currentPersona.niche);

  const niches = useMemo(() => {
    const uniqueNiches = [...new Set(personas.map((p) => p.niche))];
    return uniqueNiches;
  }, [personas]);

  const handleGenerateTopics = useCallback(async () => {
    setLoading(true);
    try {
      const topics = await generateTrendingTopics(selectedNiche);
      setTrendingTopics(topics);
    } catch (error) {
      console.error('Failed to generate topics:', error);
      // Fallback topics
      setTrendingTopics([
        {
          title: `Latest ${selectedNiche} Trends`,
          whyTrending: 'Growing interest in this field',
          contentAngle: 'Share your unique perspective',
          engagementPotential: 'High',
          bestPlatform: 'YouTube',
        },
        {
          title: `How AI is Transforming ${selectedNiche}`,
          whyTrending: 'AI disruption is a hot topic',
          contentAngle: 'Practical applications and examples',
          engagementPotential: 'High',
          bestPlatform: 'Blog',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [selectedNiche, currentPersona]);

  const handleAnalyzePerformance = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, you'd pass actual posts data
      const analysis = await analyzeContentPerformance([], currentPersona);
      setPerformanceAnalysis(analysis);
    } catch (error) {
      console.error('Failed to analyze performance:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPersona]);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-7 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky-400">Discover What's Hot</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Trending Topics</h2>
            <p className="mt-2 text-slate-400">
              AI-powered topic suggestions to help you create viral content and grow your audience.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-sky-400" />
            <h2 className="text-xl font-semibold text-white">Generate Trending Topics</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Your Niche
              </label>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              >
                {niches.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateTopics}
              disabled={loading}
              className="w-full rounded-2xl bg-sky-500 px-6 py-3 text-white font-semibold transition hover:bg-sky-400 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Trending Topics'}
            </button>
          </div>

          {trendingTopics.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Suggested Topics</h3>
              {trendingTopics.map((topic, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 transition hover:border-sky-400/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white">{topic.title}</h4>
                      <p className="mt-1 text-sm text-slate-400">{topic.whyTrending}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        topic.engagementPotential === 'High'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : topic.engagementPotential === 'Medium'
                          ? 'bg-yellow-500/15 text-yellow-300'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {topic.engagementPotential}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Lightbulb className="h-4 w-4 text-purple-400" />
                      <span>{topic.contentAngle}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Target className="h-4 w-4 text-sky-400" />
                      <span>{topic.bestPlatform}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Quick Tips to Get Famous</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 rounded-2xl bg-slate-900/50 p-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                  1
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Consistency is Key</p>
                  <p className="text-xs text-slate-400">Post at least 3 times per week</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-slate-900/50 p-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                  2
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Engage Early</p>
                  <p className="text-xs text-slate-400">Reply to comments in first hour</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-slate-900/50 p-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                  3
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Cross-Promote</p>
                  <p className="text-xs text-slate-400">Share across all platforms</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-slate-900/50 p-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                  4
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Trend Jacking</p>
                  <p className="text-xs text-slate-400">Jump on trending topics quickly</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-slate-900/50 p-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                  5
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Collaborate</p>
                  <p className="text-xs text-slate-400">Partner with other creators</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
            <div className="flex items-center gap-3 mb-4">
              <BarChart2 className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Performance Analysis</h3>
            </div>
            <button
              onClick={handleAnalyzePerformance}
              disabled={loading}
              className="w-full rounded-2xl bg-slate-800 px-4 py-3 text-sm text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing...
                </span>
              ) : (
                'Analyze My Content'
              )}
            </button>

            {performanceAnalysis && (
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-slate-900/50 p-3">
                  <p className="text-xs text-slate-400 mb-1">Consistency Score</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-sky-500"
                        style={{ width: `${(performanceAnalysis.consistencyScore || 0) * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white">
                      {performanceAnalysis.consistencyScore}/10
                    </span>
                  </div>
                </div>

                {performanceAnalysis.postingSchedule && (
                  <div className="rounded-2xl bg-slate-900/50 p-3">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">Recommended Schedule</span>
                    </div>
                    <p className="text-sm text-white">
                      {performanceAnalysis.postingSchedule.recommendedDays?.join(', ')}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {performanceAnalysis.postingSchedule.postsPerWeek} posts/week
                    </p>
                  </div>
                )}

                {performanceAnalysis.growthOpportunities && (
                  <div className="rounded-2xl bg-slate-900/50 p-3">
                    <p className="text-xs text-slate-400 mb-2">Growth Opportunities</p>
                    <ul className="space-y-1">
                      {performanceAnalysis.growthOpportunities.map((opp, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                          <Sparkles className="h-3 w-3 text-sky-400" />
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/80 p-6 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-6 w-6 text-sky-400" />
          <h2 className="text-xl font-semibold text-white">Current Persona: {currentPersona.name}</h2>
        </div>
        <p className="text-slate-400 mb-4">
          Trending topics are personalized for your niche: <strong>{currentPersona.niche}</strong> on{' '}
          <strong>{currentPersona.platform}</strong>
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Platform</p>
            <p className="text-lg font-semibold text-white">{currentPersona.platform}</p>
          </div>
          <div className="rounded-2xl bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Niche</p>
            <p className="text-lg font-semibold text-white">{currentPersona.niche}</p>
          </div>
          <div className="rounded-2xl bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Brand Color</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-4 w-4 rounded" style={{ backgroundColor: currentPersona.brandColor }} />
              <span className="text-white">{currentPersona.brandColor}</span>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-900/50 p-4">
            <p className="text-xs text-slate-400">Focus</p>
            <p className="text-lg font-semibold text-white">Content Creator</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trending;