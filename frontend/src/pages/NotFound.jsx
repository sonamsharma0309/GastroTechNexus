import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-strong border border-white/12 rounded-3xl p-8 text-center">
        <div className="text-3xl font-extrabold">404</div>
        <div className="mt-2 text-white/70">Page not found.</div>
        <div className="mt-5">
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
