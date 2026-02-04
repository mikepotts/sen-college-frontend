import React from "react";
import InstantDossierPanel from "./InstantDossierPanel.jsx";

export default function DossierDrawerHost({
  selectedProviderId,
  instantDossierById,
  deepDiveById,
  runDeepDive,
}) {
  const dossier = selectedProviderId
    ? instantDossierById?.[selectedProviderId] ?? null
    : null;

  const deepDive = selectedProviderId
    ? deepDiveById?.[selectedProviderId] ?? null
    : null;

  const [state, setState] = React.useState({ status: "idle" });

  async function trigger(providerId) {
    try {
      setState({ status: "loading" });
      await runDeepDive(providerId);
      setState({ status: "success" });
    } catch (err) {
      setState({ status: "error", error: err?.message });
    }
  }

  if (!dossier) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-600 bg-white">
        Select a college to see the overview.
      </div>
    );
  }

  return (
    <InstantDossierPanel
      dossier={dossier}
      deepDive={deepDive}
      deepDiveState={state}
      onRunDeepDive={trigger}
    />
  );
}
