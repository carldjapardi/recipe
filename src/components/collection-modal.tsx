"use client";

import { useState } from "react";

const EXTRACT_SCRIPT = `(async () => {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  if (!location.pathname.includes("/saved")) {
    const profileLinks = [...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute("href")).filter(h => h.match(/^\\/[\\w.]+\\/$/));
    const username = profileLinks.length ? profileLinks[0].replace(/\\//g, "") : null;
    if (username) { console.log("[Recipe] Detected user: " + username + ". Navigating to saved..."); location.href = "/" + username + "/saved/"; }
    else { alert("Navigate to your Saved collection first, then run this script again."); }
    return;
  }
  console.log("[Recipe] On saved page. Scrolling to load all posts...");
  let prev = -1, stable = 0;
  for (let i = 0; i < 100; i++) {
    window.scrollTo(0, document.body.scrollHeight);
    await delay(2000);
    const count = [...document.querySelectorAll('a[href]')].filter(a => /\\/(reel|p)\\//.test(a.getAttribute("href"))).length;
    console.log("[Recipe] Scroll " + (i+1) + " — " + count + " links");
    if (count === prev) { stable++; if (stable >= 2) break; } else { stable = 0; prev = count; }
  }
  const urls = [...new Set([...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => /instagram\\.com\\/(reel|p)\\//.test(h)))];
  console.log("[Recipe] Done! " + urls.length + " links:\\n" + urls.join("\\n"));
  const d = document.createElement("div");
  d.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;font-family:system-ui";
  d.innerHTML = '<div style="background:#fff;border-radius:12px;padding:24px;max-width:480px;width:90%"><p style="font-size:16px;font-weight:700;color:#1c1917;margin:0 0 12px">' + urls.length + ' links found</p><textarea id="recipe-urls" style="width:100%;height:140px;border:1px solid #d6d3d1;border-radius:8px;padding:10px;font-size:13px;color:#2563eb;line-height:1.6;resize:none">' + urls.join("\\n") + '</textarea><button id="recipe-copy" style="margin-top:12px;width:100%;padding:12px;background:#d97706;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">Copy to clipboard</button><p style="font-size:12px;color:#78716c;margin:8px 0 0;text-align:center">Then go back to the Recipe app and paste</p></div>';
  document.body.appendChild(d);
  d.addEventListener("click", e => { if (e.target === d) d.remove(); });
  document.getElementById("recipe-copy").addEventListener("click", async () => {
    document.getElementById("recipe-urls").select();
    try { await navigator.clipboard.writeText(document.getElementById("recipe-urls").value); } catch(e) { document.execCommand("copy"); }
    document.getElementById("recipe-copy").textContent = "Copied!";
  });
})();`;

function parseLinks(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => /instagram\.com\/(reel|p)\//.test(s));
}

export function CollectionModal({
  open,
  onClose,
  onLinksReady,
}: {
  open: boolean;
  onClose: () => void;
  onLinksReady: (links: string[]) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [pastedText, setPastedText] = useState("");

  async function copyAndOpen() {
    await navigator.clipboard.writeText(EXTRACT_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.open("https://www.instagram.com", "_blank");
  }

  function handleConvert() {
    const links = parseLinks(pastedText);
    if (links.length > 0) {
      onLinksReady(links);
      setPastedText("");
    }
  }

  if (!open) return null;

  const parsedCount = parseLinks(pastedText).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-stone-900">
            Extract from Instagram Saved
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            &#10005;
          </button>
        </div>

        <ol className="mt-4 space-y-3 text-sm text-stone-700">
          <li className="flex gap-2">
            <span className="shrink-0 font-medium text-amber-600">1.</span>
            <span>
              Copy the script and open Instagram:
              <button
                onClick={copyAndOpen}
                className="ml-2 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
              >
                {copied ? "Copied & Opened!" : "Copy Script & Open Instagram"}
              </button>
            </span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-medium text-amber-600">2.</span>
            <span>Open console (F12 or Cmd+Option+J), paste the script, press Enter. It auto-navigates to your saved collection and extracts links.</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-medium text-amber-600">3.</span>
            <span>Click "Copy to clipboard" on the overlay, then paste here:</span>
          </li>
        </ol>

        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Paste links here (Cmd+V / Ctrl+V)..."
          className="mt-3 h-24 w-full resize-none rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-800 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
        />

        {parsedCount > 0 && (
          <p className="mt-1 text-xs text-stone-500">
            {parsedCount} valid link{parsedCount > 1 ? "s" : ""} detected
          </p>
        )}

        <button
          onClick={handleConvert}
          disabled={parsedCount === 0}
          className="mt-3 w-full rounded-lg bg-amber-600 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Convert {parsedCount > 0 ? `${parsedCount} link${parsedCount > 1 ? "s" : ""}` : "All"}
        </button>
      </div>
    </div>
  );
}
