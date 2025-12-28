import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { AuthProvider } from "./context/useAuth";

import Login from "./routes/login";
import Menu from "./routes/menu";
import Register from "./routes/register";

import Layout from "./components/layout";
import PrivateRoute from "./components/private_route";

import Hello from "./components/Hello";
import PView from "./components/patients/PView";
import TView from "./components/tests/TView";
import TimeSlotsView from "./components/timeslots/TimeSlotsView";
import CView from "./components/consults/CView";
import UTestView from "./components/userpages/UTestView";
import NavBar from "./components/NavBar";
import CTS from "./components/consults/CTS";

function App() {
  const drawerWidth = 240;

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ---------- PUBLIC ROUTES (no NavBar) ---------- */}
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />

          {/* ---------- PRIVATE ROUTES (with NavBar) ---------- */}
          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <NavBar drawerWidth={drawerWidth} content={<Menu />} />
              </PrivateRoute>
            }
          />

          <Route
            path="/hello"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <NavBar drawerWidth={drawerWidth} content={<Hello />} />
              </PrivateRoute>
            }
          />

          <Route
            path="/tests"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <NavBar drawerWidth={drawerWidth} content={<TView />} />
              </PrivateRoute>
            }
          />

          <Route
            path="/patients"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <NavBar drawerWidth={drawerWidth} content={<PView />} />
              </PrivateRoute>
            }
          />

          <Route
            path="/tests/:id/timeslots"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <NavBar drawerWidth={drawerWidth} content={<TimeSlotsView />} />
              </PrivateRoute>
            }
          />

          <Route
            path="/view"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <NavBar drawerWidth={drawerWidth} content={<UTestView />} />
              </PrivateRoute>
            }
          />
          <Route
            path="/consultations"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <NavBar drawerWidth={drawerWidth} content={<CView />} />
              </PrivateRoute>
            }
          />
          <Route
            path="/consultations/:id/timeslots"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <NavBar drawerWidth={drawerWidth} content={<CTS />} />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
