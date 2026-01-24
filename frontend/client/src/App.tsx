import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./app/AppLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Seats from "./pages/Seats";
import Payments from "./pages/Payments";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./auth/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />

      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ---------------- PROTECTED ROUTES ---------------- */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/seats" element={<Seats />} />
          <Route path="/payments" element={<Payments />} />
        </Route>

        {/* ---------------- FALLBACK ---------------- */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}