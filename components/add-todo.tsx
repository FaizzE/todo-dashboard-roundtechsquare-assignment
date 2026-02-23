'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface AddTodoProps {
  onAdd: (title: string) => Promise<void>;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(title);
      setTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10">
      <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[10px]">⌘</span>
            Create a new task...
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Review Q3 goals"
              className="flex-1 bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="w-12 h-12 bg-slate-800 hover:bg-teal-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-300 shadow-lg hover:shadow-teal-500/20"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </button>
          </div>
      </div>
    </form>
  );
}
