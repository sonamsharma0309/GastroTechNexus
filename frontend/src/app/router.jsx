import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/Landing.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import IngredientAnalyzer from "../pages/IngredientAnalyzer.jsx";
import RecipeGenerator from "../pages/RecipeGenerator.jsx";
import HealthProfile from "../pages/HealthProfile.jsx";
import Alerts from "../pages/Alerts.jsx";
import NotFound from "../pages/NotFound.jsx";

import AppShell from "../components/layout/AppShell.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* App routes inside shell */}
      <Route
        path="/app"
        element={
          <AppShell>
            <Dashboard />
          </AppShell>
        }
      />
      <Route
        path="/app/analyzer"
        element={
          <AppShell>
            <IngredientAnalyzer />
          </AppShell>
        }
      />
      <Route
        path="/app/recipes"
        element={
          <AppShell>
            <RecipeGenerator />
          </AppShell>
        }
      />
      <Route
        path="/app/profile"
        element={
          <AppShell>
            <HealthProfile />
          </AppShell>
        }
      />
      <Route
        path="/app/alerts"
        element={
          <AppShell>
            <Alerts />
          </AppShell>
        }
      />

      <Route path="/dashboard" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
