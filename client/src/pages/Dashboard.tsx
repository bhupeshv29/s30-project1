import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Check, Trash2 } from "lucide-react";
import api from "../lib/api";
import type { Todo, TodosResponse } from "../types";

const Dashboard = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTodos = useCallback(async () => {
    try {
      const { data } = await api.get<TodosResponse>("/todos");
      setTodos(data.todos);
    } catch {
      setToken(null);
      navigate("/auth");
    }
  }, [setToken, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchTodos();
  }, [token, navigate, fetchTodos]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await api.post("/todos", {
        title: title.trim(),
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
      await fetchTodos();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      await api.patch(`/todos/${id}/completed`);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      );
    } catch {}
  };

  const deleteTodo = async (id: string) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {}
  };

  const logout = () => {
    setToken(null);
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Todos</h1>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-white transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={addTodo} className="flex flex-col gap-3 mb-8">
          <input
            type="text"
            placeholder="Title?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full px-6 py-3 bg-white text-gray-950 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Add
          </button>
        </form>

        <div className="space-y-3">
          {todos.length === 0 && (
            <p className="text-gray-600 text-center py-12">No todos yet</p>
          )}
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-4 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  todo.completed
                    ? "bg-white border-white"
                    : "border-gray-600 hover:border-gray-400"
                }`}
              >
                {todo.completed && (
                  <Check className="w-3 h-3 text-gray-950" strokeWidth={3} />
                )}
              </button>

              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => navigate(`/todo/${todo.id}`)}
              >
                <p
                  className={`${
                    todo.completed ? "text-gray-500 line-through" : "text-white"
                  }`}
                >
                  {todo.title}
                </p>
                {todo.description && (
                  <p className="text-sm text-gray-500 truncate">
                    {todo.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
