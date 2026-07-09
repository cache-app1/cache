"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export function AuthGate({
  children,
}: {
  children: (session: Session) => ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setSubmitting(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setInfoMessage(
          "Check your email to confirm your account, then sign in."
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      }
    }
    setSubmitting(false);
  }

  async function handleGuest() {
    setError(null);
    setInfoMessage(null);
    setSubmitting(true);
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      setError(error.message);
    }
    setSubmitting(false);
  }

  if (loading) {
    return <div className="p-6 text-sm text-zinc-400">Loading...</div>;
  }

  if (!session) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-zinc-900 italic">
          Cache
        </h1>
        <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            {infoMessage && (
              <p className="text-sm text-green-700">{infoMessage}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              {submitting ? "..." : mode === "signup" ? "Sign up" : "Sign in"}
            </button>
          </form>
          <button
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError(null);
              setInfoMessage(null);
            }}
            className="mt-5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
          >
            {mode === "signup"
              ? "Already have an account? Sign in"
              : "New here? Sign up"}
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-zinc-400">
            <div className="h-px flex-1 bg-zinc-200" />
            or
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <button
            onClick={handleGuest}
            disabled={submitting}
            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50"
          >
            Continue without an account
          </button>
          <p className="mt-3 text-xs leading-relaxed text-zinc-400">
            You can always add an email later to keep access to your
            screenshots from another device.
          </p>
        </div>
      </main>
    );
  }

  return <>{children(session)}</>;
}