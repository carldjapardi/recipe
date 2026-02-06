"use client";

import { useState } from "react";
import { UrlInput } from "@/components/url-input";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeDetail } from "@/components/recipe-detail";
import { CollectionModal } from "@/components/collection-modal";
import { BatchProgress } from "@/components/batch-progress";
import { SavedRecipe } from "@/types/recipe";

export default function Home() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingLinks, setPendingLinks] = useState<string[]>([]);
  const [batch, setBatch] = useState<{
    total: number;
    completed: number;
    failed: number;
    currentUrl: string | null;
  } | null>(null);

  async function handleSubmit(url: string) {
    setLoading(true);
    setError(null);
    setSelectedId(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }

      const saved: SavedRecipe = {
        ...data,
        id: crypto.randomUUID(),
        sourceUrl: url,
      };
      setRecipes((prev) => [saved, ...prev]);
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

  function handleLinksReady(links: string[]) {
    setPendingLinks(links);
    setModalOpen(false);
  }

  async function handleConvertAll() {
    if (pendingLinks.length === 0) return;

    const links = [...pendingLinks];
    setPendingLinks([]);
    setBatch({ total: links.length, completed: 0, failed: 0, currentUrl: null });

    for (const url of links) {
      setBatch((b) => b && { ...b, currentUrl: url });

      try {
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const data = await res.json();

        if (res.ok) {
          const saved: SavedRecipe = {
            ...data,
            id: crypto.randomUUID(),
            sourceUrl: url,
          };
          setRecipes((prev) => [saved, ...prev]);
          setBatch((b) => b && { ...b, completed: b.completed + 1 });
        } else {
          setBatch((b) => b && { ...b, failed: b.failed + 1 });
        }
      } catch {
        setBatch((b) => b && { ...b, failed: b.failed + 1 });
      }
    }

    setBatch(null);
  }

  const selected = recipes.find((r) => r.id === selectedId) ?? null;
  const isBusy = loading || batch !== null;

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Recipe</h1>
        <p className="mt-1 text-sm text-stone-500">
          Paste an Instagram cooking video to extract a written recipe
        </p>
      </div>

      <UrlInput
        onSubmit={handleSubmit}
        onExtractFromSaved={() => setModalOpen(true)}
        loading={isBusy}
      />

      {loading && (
        <div className="mt-8 flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-200 border-t-amber-600" />
          <p className="text-sm text-stone-500">
            Downloading video and extracting recipe...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      {pendingLinks.length > 0 && !batch && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-stone-800">
            {pendingLinks.length} links ready to convert
          </p>
          <button
            onClick={handleConvertAll}
            className="mt-3 rounded-lg bg-amber-600 px-5 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            Convert All
          </button>
        </div>
      )}

      {batch && (
        <BatchProgress
          total={batch.total}
          completed={batch.completed}
          failed={batch.failed}
          currentUrl={batch.currentUrl}
        />
      )}

      <div className="mt-8">
        {selected ? (
          <RecipeDetail
            recipe={selected}
            onBack={() => setSelectedId(null)}
          />
        ) : recipes.length > 0 ? (
          <>
            <h2 className="mb-4 text-sm font-medium text-stone-400 uppercase tracking-wide">
              Saved Recipes ({recipes.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {recipes.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  onClick={() => setSelectedId(r.id)}
                />
              ))}
            </div>
          </>
        ) : (
          !isBusy && (
            <p className="text-sm text-stone-400">
              No recipes yet. Paste a link above to get started.
            </p>
          )
        )}
      </div>

      <CollectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onLinksReady={handleLinksReady}
      />
    </div>
  );
}
