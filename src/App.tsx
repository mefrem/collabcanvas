import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CanvasProvider } from "./contexts/CanvasContext";
import { CollaborationProvider } from "./contexts/CollaborationContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CanvasPage from "./pages/CanvasPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/canvas"
            element={
              <ProtectedRoute>
                <CanvasProvider>
                  <CollaborationProvider>
                    <CanvasPage />
                  </CollaborationProvider>
                </CanvasProvider>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/canvas" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
