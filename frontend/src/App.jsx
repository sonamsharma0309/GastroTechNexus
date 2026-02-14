import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./app/providers.jsx";
import AppRouter from "./app/router.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </BrowserRouter>
  );
}
