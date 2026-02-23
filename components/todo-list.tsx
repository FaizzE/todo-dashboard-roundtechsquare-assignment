'use client';

import { Todo } from '@/types/todo';
import { TodoItem } from './todo-item';
import { AnimatePresence } from 'motion/react';

interface TodoListProps {
  todos: Todo[];
  onToggle: (todo: Todo) => void;
  togglingId: number | null;
}

export function TodoList({ todos, onToggle, togglingId }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No todos found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <AnimatePresence mode="popLayout">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            isToggling={togglingId === todo.id}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
