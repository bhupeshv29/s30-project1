import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TodoDetail from "./pages/TodoDetail";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todo/:id"
            element={
              <ProtectedRoute>
                <TodoDetail />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
