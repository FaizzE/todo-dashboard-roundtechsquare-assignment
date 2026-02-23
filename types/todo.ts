export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  isLocal?: boolean; // To identify locally added todos
}

export interface FetchTodosResponse {
  todos: Todo[];
  totalCount: number;
}
