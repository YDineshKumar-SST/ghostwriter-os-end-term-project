import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePersona } from "../context/PersonaContext";
import { Search, User, Settings, Home, Sparkles } from "lucide-react";

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { personas, switchPersona } = usePersona();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((value) => !value);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const actions = useMemo(
    () => [
      ...personas.map((persona) => ({ type: "persona", id: persona.id, label: `Switch to ${persona.name}`, icon: User })),
      { type: "navigate", path: "/", label: "Go to Dashboard", icon: Home },
      { type: "navigate", path: "/settings", label: "Go to Settings", icon: Settings },
      { type: "draft", label: "Search current drafts", icon: Search },
      { type: "info", label: "View persona health", icon: Sparkles },
    ],
    [personas],
  );

  const filteredActions = actions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (action) => {
    if (action.type === "persona") {
      switchPersona(action.id);
    }

    if (action.type === "navigate") {
      navigate(action.path);
    }

    setIsOpen(false);
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/95 shadow-2xl">
        <div className="border-b border-slate-800/80 px-5 py-4">
          <input
            ref={inputRef}
            aria-label="Command palette search"
            placeholder="Type a command or persona..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
          />
        </div>
        <div className="max-h-96 overflow-y-auto px-2 py-2">
          {filteredActions.length === 0 ? (
            <div className="p-6 text-center text-slate-400">No matching commands.</div>
          ) : (
            filteredActions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(action)}
                className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-200 transition hover:bg-slate-800"
              >
                <action.icon className="h-5 w-5 text-sky-400 transition group-hover:text-sky-300" />
                <span>{action.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
