"use client";

import { useEffect, useCallback, useState } from "react";

const EXTRACT_SCRIPT = `(async () => {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  let prev = 0;
  while (true) {
    window.scrollTo(0, document.body.scrollHeight);
    await delay(1500);
    const links = document.querySelectorAll('a[href*="/reel/"], a[href*="/p/"]');
    if (links.length === prev) break;
    prev = links.length;
  }
  const urls = [...new Set(
    [...document.querySelectorAll('a[href*="/reel/"], a[href*="/p/"]')]
      .map(a => a.href)
  )];
  if (window.opener) {
    window.opener.postMessage({ type: "recipe-links", links: urls }, "*");
  }
  await navigator.clipboard.writeText(urls.join("\\n"));
  alert(urls.length + " links extracted!");
})();`;

export function CollectionModal({
  open,
  onClose,
  onLinksReceived,
}: {
  open: boolean;
  onClose: () => void;
  onLinksReceived: (links: string[]) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleMessage = useCallback(
    (e: MessageEvent) => {
      if (e.data?.type === "recipe-links" && Array.isArray(e.data.links)) {
        onLinksReceived(e.data.links);
      }
    },
    [onLinksReceived]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  function openInstagram() {
    window.open("https://www.instagram.com", "_blank", "width=500,height=700");
  }

  async function copyScript() {
    await navigator.clipboard.writeText(EXTRACT_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-stone-900">
            Extract from Instagram Saved
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600"
          >
            &#10005;
          </button>
        </div>

        <ol className="mt-4 space-y-3 text-sm text-stone-700">
          <li className="flex gap-2">
            <span className="shrink-0 font-medium text-amber-600">1.</span>
            <span>
              Click the button below to open Instagram in a new window.
              <button
                onClick={openInstagram}
                className="ml-2 rounded bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700"
              >
                Open Instagram
              </button>
            </span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-medium text-amber-600">2.</span>
            <span>Log in and navigate to your Saved collection with food videos.</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-medium text-amber-600">3.</span>
            <span>
              Open the browser console (F12 or Cmd+Option+J) and paste this script:
            </span>
          </li>
        </ol>

        <div className="mt-3 rounded-lg bg-stone-50 p-3">
          <pre className="max-h-32 overflow-auto text-xs text-stone-600">
            {EXTRACT_SCRIPT}
          </pre>
          <button
            onClick={copyScript}
            className="mt-2 rounded bg-stone-200 px-3 py-1 text-xs font-medium text-stone-700 hover:bg-stone-300"
          >
            {copied ? "Copied!" : "Copy Script"}
          </button>
        </div>

        <p className="mt-4 text-xs text-stone-500">
          The script will auto-scroll, collect all links, and send them back here automatically.
          You can also paste links manually after they are copied to your clipboard.
        </p>
      </div>
    </div>
  );
}
