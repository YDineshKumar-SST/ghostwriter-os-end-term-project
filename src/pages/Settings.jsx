import React, { useState } from 'react';
import { usePersona } from '../context/PersonaContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Layers, ShieldCheck, Database, Key } from 'lucide-react';

const Settings = () => {
  const { currentPersona } = usePersona();
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState(localStorage.getItem('ai_api_key') || localStorage.getItem('openai_api_key') || '');
  const [providerUrl, setProviderUrl] = useState(localStorage.getItem('ai_provider_url') || '');
  const [apiHeader, setApiHeader] = useState(localStorage.getItem('ai_api_header') || 'Authorization');

  const handleSaveApiKey = () => {
    localStorage.setItem('ai_api_key', apiKey);
    localStorage.setItem('ai_provider_url', providerUrl);
    localStorage.setItem('ai_api_header', apiHeader);
    alert('AI provider settings saved!');
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-8 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Workspace settings</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Persona configuration</h2>
          </div>
          <div className="rounded-3xl bg-slate-900 px-5 py-3 text-sm text-slate-300">
            <p className="text-slate-500">Authenticated user</p>
            <div className="mt-2 font-semibold text-white">{user?.email ?? 'Unknown user'}</div>
            <div className="text-slate-500">{currentPersona.platform} • {currentPersona.niche}</div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6">
            <div className="flex items-center gap-3 text-sky-400">
              <Layers className="h-5 w-5" />
              <span className="text-xs uppercase tracking-[0.3em]">Build workflow</span>
            </div>
            <p className="mt-4 text-slate-300">Use the command palette, persona cards, and keyboard-first workflow to keep writing momentum.</p>
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6">
            <div className="flex items-center gap-3 text-sky-400">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs uppercase tracking-[0.3em]">AI assistant</span>
            </div>
            <p className="mt-4 text-slate-300">AI-driven recommendations analyze your current content backlog and suggest next completions.</p>
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6">
            <div className="flex items-center gap-3 text-sky-400">
              <Database className="h-5 w-5" />
              <span className="text-xs uppercase tracking-[0.3em]">Backend integration</span>
            </div>
            <p className="mt-4 text-slate-300">Supabase auth and storage are ready to persist your persona content and post history.</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-8 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
        <h3 className="text-2xl font-semibold text-white">Persona notes</h3>
        <p className="mt-4 max-w-2xl text-slate-400">Keep this page as the central place to wire up advanced preferences, integrations, and persona health checks.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-500">Brand color</p>
            <div className="mt-4 h-12 rounded-2xl" style={{ backgroundColor: currentPersona.brandColor }} />
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-500">Persona focus</p>
            <p className="mt-4 text-white">{currentPersona.niche}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-8 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
        <div className="flex items-center gap-3">
          <Key className="h-6 w-6 text-sky-400" />
          <h3 className="text-2xl font-semibold text-white">AI Configuration</h3>
        </div>
        <p className="mt-4 text-slate-400">Configure your OpenAI API key for AI-powered blog generation and comments.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">AI Provider URL</label>
            <input
              type="url"
              value={providerUrl}
              onChange={(e) => setProviderUrl(e.target.value)}
              className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
              placeholder="https://api.openai.com/v1/chat/completions"
            />
            <p className="mt-2 text-sm text-slate-500">Leave empty to use the default OpenAI endpoint.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">API Key Header</label>
            <input
              type="text"
              value={apiHeader}
              onChange={(e) => setApiHeader(e.target.value)}
              className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
              placeholder="Authorization"
            />
            <p className="mt-2 text-sm text-slate-500">Use the header name required by your provider (default is Authorization).</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-2 block w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
              placeholder="Enter API key"
            />
          </div>
          <button
            onClick={handleSaveApiKey}
            className="mt-2 rounded-2xl bg-sky-500 px-6 py-3 text-white hover:bg-sky-600 focus:outline-none"
          >
            Save AI Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
