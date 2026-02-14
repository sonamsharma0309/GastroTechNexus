import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

export async function pingHealth() {
  const res = await api.get("/health");
  return res.data; // { status: "ok" }
}

export async function analyzeIngredient(payload) {
  // payload: { ingredient: string, conditions?: string[], phase?: string }
  const res = await api.post("/api/analyze", payload);
  return res.data;
}
