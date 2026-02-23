import { FetchTodosResponse, Todo } from '@/types/todo';

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

export async function fetchTodos(page: number, limit: number): Promise<FetchTodosResponse> {
  const response = await fetch(`${BASE_URL}?_page=${page}&_limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  const totalCount = Number(response.headers.get('x-total-count') || '0');
  const todos: Todo[] = await response.json();

  return { todos, totalCount };
}

export async function toggleTodoStatus(todo: Todo): Promise<Todo> {
  // Simulate API call
  const response = await fetch(`${BASE_URL}/${todo.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed: !todo.completed }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) {
    // If it's a local todo (id > 200 usually for jsonplaceholder, or custom id), the API might 404.
    // In that case, we just return the toggled state locally.
    if (todo.isLocal) {
        return { ...todo, completed: !todo.completed };
    }
    throw new Error('Failed to update todo');
  }

  return response.json();
}

export async function addTodo(title: string): Promise<Todo> {
  // Simulate API call
  const response = await fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({
      title,
      completed: false,
      userId: 1,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to add todo');
  }

  const data = await response.json();
  // JSONPlaceholder always returns ID 201 for new items. 
  // We'll generate a random ID to avoid collisions in our local list if we add multiple.
  return { ...data, id: Date.now(), isLocal: true }; 
}
