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
    setUrl("");
  }

  const valid = url.trim() === "" || INSTAGRAM_URL_RE.test(url.trim());

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste an Instagram Reel URL..."
          className="flex-1 rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim() || !valid}
          className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Extracting..." : "Extract"}
        </button>
      </div>
      {!valid && (
        <p className="mt-1.5 text-xs text-red-500">
          Enter a valid Instagram Reel or post URL
        </p>
      )}
    </form>
  );
}
