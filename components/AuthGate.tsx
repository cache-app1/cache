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
    return <div className="p-6 text-sm text-gray-500">Loading...</div>;
  }

  if (!session) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
        <h1 className="mb-6 text-2xl font-bold">Cache</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {infoMessage && (
            <p className="text-sm text-green-700">{infoMessage}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
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
          className="mt-4 text-sm text-gray-500 hover:text-black"
        >
          {mode === "signup"
            ? "Already have an account? Sign in"
            : "New here? Sign up"}
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
          <div className="h-px flex-1 bg-gray-200" />
          or
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          onClick={handleGuest}
          disabled={submitting}
          className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Continue without an account
        </button>
        <p className="mt-2 text-xs text-gray-400">
          You can always add an email later to keep access to your screenshots
          from another device.
        </p>
      </main>
    );
  }

  return <>{children(session)}</>;
}