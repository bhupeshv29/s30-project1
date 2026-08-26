import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../lib/api";
import type { AuthResponse } from "../types";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/signin";
      const { data } = await api.post<AuthResponse>(endpoint, { email, password });

      if (isSignup) {
        const signinRes = await api.post<AuthResponse>("/auth/signin", { email, password });
        setToken(signinRes.data.token!);
      } else {
        setToken(data.token!);
      }

      navigate("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-white mb-8 text-center">
          {isSignup ? "Create account" : "Welcome back"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-gray-950 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {loading ? "Loading..." : isSignup ? "Sign up" : "Sign in"}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            className="text-white hover:underline"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
