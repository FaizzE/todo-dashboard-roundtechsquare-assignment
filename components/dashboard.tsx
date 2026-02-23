'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTodos, toggleTodoStatus, addTodo } from '@/lib/api';
import { Todo } from '@/types/todo';
import { TodoList } from './todo-list';
import { Pagination } from './pagination';
import { AddTodo } from './add-todo';
import { Loader2, AlertCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [localTodos, setLocalTodos] = useState<Todo[]>([]);
  // Store toggled states locally since API doesn't persist
  const [toggledOverrides, setToggledOverrides] = useState<Record<number, boolean>>({});
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ['todos', page],
    queryFn: () => fetchTodos(page, ITEMS_PER_PAGE),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
  });

  const toggleMutation = useMutation({
    mutationFn: toggleTodoStatus,
    onMutate: async (todo) => {
      setTogglingId(todo.id);
      // Optimistic update logic could go here, but we are using local overrides
    },
    onSuccess: (updatedTodo, variables) => {
      // Update local override
      setToggledOverrides((prev) => ({
        ...prev,
        [variables.id]: !variables.completed,
      }));
    },
    onError: (err) => {
      console.error('Failed to toggle todo', err);
      alert('Failed to update todo status');
    },
    onSettled: () => {
      setTogglingId(null);
    },
  });

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: (newTodo) => {
      setLocalTodos((prev) => [newTodo, ...prev]);
    },
    onError: (err) => {
      console.error('Failed to add todo', err);
      alert('Failed to add todo');
    },
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Merge data
  const serverTodos = data?.todos || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Apply overrides to server todos
  const processedServerTodos = serverTodos.map((todo) => ({
    ...todo,
    completed: toggledOverrides[todo.id] !== undefined ? toggledOverrides[todo.id] : todo.completed,
  }));

  // Apply overrides to local todos (if any)
  const processedLocalTodos = localTodos.map((todo) => ({
    ...todo,
    completed: toggledOverrides[todo.id] !== undefined ? toggledOverrides[todo.id] : todo.completed,
  }));

  // Combine: Local todos first, then server todos
  // Note: In a real app with proper pagination, adding a todo might not just prepend it to the current page view,
  // but for this "local only" requirement, showing it immediately is best.
  const displayTodos = [...processedLocalTodos, ...processedServerTodos];

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">Error loading todos</p>
        <p className="text-sm opacity-80">{(error as Error).message}</p>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['todos'] })}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 md:p-12 flex flex-col relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-teal-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Header & Main Content Area */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-white tracking-tight mb-2">
              Focus.
            </h1>
            <p className="text-slate-400 text-lg font-light tracking-wide">
              Your daily task command center.
            </p>
          </div>

          <div className="flex-1 flex flex-col min-h-[600px] bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-1 shadow-2xl overflow-hidden relative">
            {/* Header of the list container */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {isLoading && !data ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-teal-400 animate-spin opacity-50" />
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1 custom-scrollbar">
                  <TodoList 
                    todos={displayTodos} 
                    onToggle={(todo) => toggleMutation.mutate(todo)}
                    togglingId={togglingId}
                  />
                </div>
                
                <div className="p-4 border-t border-white/5 bg-slate-900/20">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={isLoading || isPlaceholderData}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6 pt-0 lg:pt-32">
          {/* Stats Pill */}
          <div className="flex justify-end mb-4">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-white/10 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                {totalCount} TASKS TOTAL
             </div>
          </div>

          {/* Add Task Card */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
             <AddTodo onAdd={async (title) => { await addMutation.mutateAsync(title); }} />
          </div>

          {/* Pro Tip Card */}
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/50" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Pro Tip</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Break large tasks into smaller steps to maintain momentum. Consistency is key to long-term progress.
            </p>
          </div>
        </div>

      </div>

      {/* Footer Status */}
      <div className="mt-12 text-center">
        <p className="text-[10px] font-mono text-slate-600 tracking-[0.2em] uppercase">
          System Status: Online • V2.0.0
        </p>
      </div>
    </div>
  );
}
