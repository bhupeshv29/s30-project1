import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import api from "../lib/api";
import type { Todo } from "../types";

const TodoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const { data } = await api.get<{ todo: Todo }>(`/todos/${id}`);
        setTodo(data.todo);
      } catch {
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchTodo();
  }, [id, navigate]);

  const toggleTodo = async () => {
    if (!todo) return;
    try {
      await api.patch(`/todos/${todo.id}/completed`);
      setTodo((prev) =>
        prev ? { ...prev, completed: !prev.completed } : prev,
      );
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!todo) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-start gap-4 mb-6">
          <button
            onClick={toggleTodo}
            className={`w-5 h-5 mt-1 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
              todo.completed
                ? "bg-white border-white"
                : "border-gray-600 hover:border-gray-400"
            }`}
          >
            {todo.completed && (
              <Check className="w-3 h-3 text-gray-950" strokeWidth={3} />
            )}
          </button>
          <h1
            className={`text-xl font-semibold ${
              todo.completed ? "text-gray-500 line-through" : ""
            }`}
          >
            {todo.title}
          </h1>
        </div>

        <div className="pl-9">
          {todo.description ? (
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {todo.description}
            </p>
          ) : (
            <p className="text-gray-600">No description</p>
          )}
        </div>

        <div className="mt-8 pl-9 text-sm text-gray-600 space-y-1">
          <p>Created {new Date(todo.createdAt).toLocaleString()}</p>
          <p>Updated {new Date(todo.updatedAt).toLocaleString()}</p>
        </div>
      </main>
    </div>
  );
};

export default TodoDetail;
