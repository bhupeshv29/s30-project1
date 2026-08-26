export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  completed: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SignupInput {
  email: string;
  password: string;
}

export interface SigninInput {
  email: string;
  password: string;
}

export interface CreateTodoInput {
  title: string;
  description: string;
}

export interface AuthResponse {
  message: string;
  userId?: string;
  token?: string;
}

export interface TodosResponse {
  todos: Todo[];
}
