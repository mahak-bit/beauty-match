"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/admin/add-product");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold-deep)]">
        Admin
      </span>
      <h1 className="font-display text-3xl mt-4 mb-8">Enter password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full bg-[var(--surface)] border border-[var(--hairline)] rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--gold)]"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 rounded-full bg-[var(--ink)] text-[var(--bg)] font-medium hover:bg-[var(--gold-deep)] transition-colors disabled:opacity-50"
        >
          {loading ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}