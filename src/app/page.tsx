"use client";

import { useState } from "react";
import { UrlInput } from "@/components/url-input";
import { RecipeCard } from "@/components/recipe-card";
import { Recipe } from "@/types/recipe";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; recipe: Recipe }
  | { status: "error"; message: string };

export default function Home() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function handleSubmit(url: string) {
    setState({ status: "loading" });

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState({ status: "error", message: data.error || "Request failed" });
        return;
      }

      setState({ status: "success", recipe: data });
    } catch {
      setState({ status: "error", message: "Failed to connect to server" });
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Recipe</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Paste an Instagram cooking video link to get a written recipe
        </p>
      </div>

      <UrlInput onSubmit={handleSubmit} loading={state.status === "loading"} />

      <div className="mt-8 w-full max-w-xl">
        {state.status === "loading" && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
            <p className="text-sm text-zinc-500">
              Downloading video and extracting recipe...
            </p>
          </div>
        )}

        {state.status === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {state.message}
          </div>
        )}

        {state.status === "success" && <RecipeCard recipe={state.recipe} />}
      </div>
    </div>
  );
}
