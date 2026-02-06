import React from "react";
import DossierDrawerHost from "./components/DossierDrawerHost.jsx";
import { API_BASE } from "./lib/config.js";

export default function App() {
  // -----------------------------
  // Search form state - simplified for GenAI-driven matching
  // -----------------------------
  const [postcode, setPostcode] = React.useState(() =>
    localStorage.getItem("postcode") || "MK18 3BN"
  );
  const [radius, setRadius] = React.useState(50);
  const [prompt, setPrompt] = React.useState(() =>
    localStorage.getItem("prompt") || ""
  );

  // -----------------------------
  // Provider list + dossiers
  // -----------------------------
  const [providers, setProviders] = React.useState([]);
  const [instantById, setInstantById] = React.useState({});
  const [deepDiveById, setDeepDiveById] = React.useState({});
  const [selectedProviderId, setSelectedProviderId] = React.useState(null);

  // -----------------------------
  // Fetcher: load providers with GenAI-driven matching
  // -----------------------------
  async function loadInstant() {
    try {
      localStorage.setItem("postcode", postcode);
      localStorage.setItem("prompt", prompt);

      const url = new URL(`${API_BASE}/instant`);
      url.searchParams.set("postcode", postcode);
      url.searchParams.set("radius_miles", String(radius));
      url.searchParams.set("target_count", "20");
      
      // Send prompt (primary input for GenAI intent extraction)
      if (prompt.trim()) {
        url.searchParams.set("prompt", prompt);
      }

      const res = await fetch(url.toString());
      const data = await res.json();

      // Use the providers array from the new API response format
      const allDossiers = data.providers || [];

      // Build provider list
      const pList = allDossiers.map((d) => ({
        provider_id: d.provider.provider_id,
        name: d.provider.name,
      }));

      // Create ID → dossier map
      const map = {};
      allDossiers.forEach((d) => (map[d.provider.provider_id] = d));

      setProviders(pList);
      setInstantById(map);

      if (pList.length) {
        setSelectedProviderId(pList[0].provider_id);
      }
    } catch (e) {
      console.error("Failed to load instant:", e);
    }
  }

  // -----------------------------
  // Deep Dive handler
  // -----------------------------
  async function runDeepDive(providerId) {
    const res = await fetch(`${API_BASE}/deep-dive`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider_id: providerId }),
    });

    const payload = await res.json();
    setDeepDiveById((prev) => ({
      ...prev,
      [providerId]: payload,
    }));

    return payload;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ---------------------------------------- */}
        {/* LEFT PANEL – SEARCH FORM + PROVIDERS     */}
        {/* ---------------------------------------- */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">

            {/* Search Controls */}
            <h1 className="text-lg font-semibold">Find Colleges</h1>
            <p className="text-sm text-slate-600 mt-1">
              Describe what you're looking for in your own words.
            </p>

            {/* --------------------- */}
            {/* SEARCH FORM UI        */}
            {/* --------------------- */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loadInstant();
              }}
              className="mt-4 grid grid-cols-1 gap-3"
            >
              {/* Prompt input - PRIMARY INPUT */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  What are you looking for? <span className="text-red-500" aria-label="required">*</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., I want to do catering at a residential college with autism support..."
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm w-full resize-none"
                  rows={4}
                  required
                  aria-required="true"
                />
                <p className="text-xs text-slate-500 mt-1">
                  <span role="img" aria-label="Tip">💡</span> Be specific! Mention interests (like catering, IT), needs (autism, ADHD), and preferences (residential, small classes)
                </p>
              </div>

              {/* Postcode input */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Your postcode
                </label>
                <input
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="UK postcode e.g. MK18 3BN"
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm w-full"
                />
              </div>

              {/* Radius selector */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Search radius
                </label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value, 10))}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm w-full"
                >
                  {[30, 40, 50, 80, 100, 150, 200].map((m) => (
                    <option key={m} value={m}>
                      Within {m} miles
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="rounded-xl bg-slate-900 text-white px-3 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Search
              </button>
            </form>

            {/* -------------------------------- */}
            {/* Results – Provider List           */}
            {/* -------------------------------- */}
            <h2 className="text-lg font-semibold mt-6">Providers</h2>
            {providers.length === 0 && (
              <p className="text-sm text-slate-500 mt-2">
                No providers yet — run a search.
              </p>
            )}

            <div className="mt-4 space-y-2">
              {providers.map((p) => (
                <button
                  key={p.provider_id}
                  onClick={() => setSelectedProviderId(p.provider_id)}
                  className={`w-full text-left rounded-xl border p-3 transition-colors ${
                    selectedProviderId === p.provider_id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="font-medium">{p.name}</div>
                  <div
                    className={`text-xs mt-1 ${
                      selectedProviderId === p.provider_id
                        ? "text-white/80"
                        : "text-slate-500"
                    }`}
                  >
                    Click to view
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------------------------------- */}
        {/* RIGHT PANEL – DOSSIER PANEL              */}
        {/* ---------------------------------------- */}
        <div className="lg:col-span-2">
          <DossierDrawerHost
            selectedProviderId={selectedProviderId}
            instantDossierById={instantById}
            deepDiveById={deepDiveById}
            runDeepDive={runDeepDive}
          />
        </div>

      </div>
    </div>
  );
}
