"use client";

import { useState } from "react";

const INSTAGRAM_URL_RE =
  /^https?:\/\/(www\.)?instagram\.com\/(reel|p|reels)\/[\w-]+/;

export function UrlInput({
  onSubmit,
  loading,
}: {
  onSubmit: (url: string) => void;
  loading: boolean;
}) {
  const [url, setUrl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    onSubmit(url.trim());
  }

  const valid = url.trim() === "" || INSTAGRAM_URL_RE.test(url.trim());

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-3">
      <div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste an Instagram Reel URL..."
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
          disabled={loading}
        />
        {!valid && (
          <p className="mt-1.5 text-sm text-red-500">
            Enter a valid Instagram Reel or post URL
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || !url.trim() || !valid}
        className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-base font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {loading ? "Extracting recipe..." : "Extract Recipe"}
      </button>
    </form>
  );
}
