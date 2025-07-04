import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./services/auth";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Tasks from "./pages/Tasks";
import SignIn from "./pages/Sign-in";
import SignUp from "./pages/Sign-up";

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route
            path="/signin"
            element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
