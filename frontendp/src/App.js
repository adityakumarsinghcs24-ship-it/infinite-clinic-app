import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/useAuth";
import PrivateRoute from "./components/private_route";

// Import the NavBar layout component
import NavBar from "./components/NavBar";

// PUBLIC
import Login from "./routes/login";
import Register from "./routes/register";

// PRIVATE
import { Home } from "./components/patientpages/Home";
// 1. Import the new TestsPage component
import TestsPage from "./components/tests/TestsPage";
// 2. Import the new DoctorsPage component
import DoctorsPage from "./components/doctors/DoctorsPage";
// 3. Import the new CartPage component
import CartPage from "./components/cart/CartPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ---------- PRIVATE ROUTES ---------- */}
          <Route
            path="/home"
            element={
              <PrivateRoute allowedRoles={["admin", "patient"]}>
                {/* Wrap the page content with the NavBar */}
                <NavBar content={<Home />} />
              </PrivateRoute>
            }
          />

          {/* 2. Add the new /tests route */}
          <Route
            path="/tests"
            element={
              <PrivateRoute allowedRoles={["admin", "patient"]}>
                <NavBar content={<TestsPage />} />
              </PrivateRoute>
            }
          />

          {/* 3. Add the new /doctors route */}
          <Route
            path="/doctors"
            element={
              <PrivateRoute allowedRoles={["admin", "patient"]}>
                <NavBar content={<DoctorsPage />} />
              </PrivateRoute>
            }
          />

          {/* 4. Add the new /cart route */}
          <Route
            path="/cart"
            element={
              <PrivateRoute allowedRoles={["admin", "patient"]}>
                <NavBar content={<CartPage />} />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
