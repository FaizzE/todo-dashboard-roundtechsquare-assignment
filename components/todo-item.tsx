'use client';

import { Todo } from '@/types/todo';
import { Check, Loader2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  isToggling: boolean;
}

export function TodoItem({ todo, onToggle, isToggling }: TodoItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      whileHover={{ scale: 1.005, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      className={`group flex items-center justify-between p-4 mb-2 rounded-xl border transition-all duration-300 ${
        todo.completed 
          ? 'bg-slate-900/20 border-white/5' 
          : 'bg-white/5 border-white/5 hover:border-white/10'
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={() => onToggle(todo)}
          disabled={isToggling}
          className={`relative flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
            todo.completed
              ? 'bg-teal-500 border-teal-500 text-white shadow-[0_0_10px_rgba(20,184,166,0.5)]'
              : 'border-slate-600 hover:border-teal-400 bg-transparent'
          }`}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {isToggling ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <motion.div
              initial={false}
              animate={{ scale: todo.completed ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </motion.div>
          )}
        </button>
        
        <span
          className={`text-sm sm:text-base font-medium truncate transition-all duration-300 ${
            todo.completed ? 'text-slate-600 line-through' : 'text-slate-200 group-hover:text-white'
          }`}
        >
          {todo.title}
        </span>
      </div>
      
      <div className="flex items-center gap-3 ml-4">
        {todo.isLocal && (
          <span className="text-[10px] font-bold tracking-wider text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded border border-teal-400/20 uppercase">
            New
          </span>
        )}
        <span className="text-xs font-mono text-slate-700 group-hover:text-slate-600 transition-colors">
          #{todo.id}
        </span>
      </div>
    </motion.div>
  );
}
