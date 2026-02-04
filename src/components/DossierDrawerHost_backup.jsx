
import React from 'react';
import InstantDossierPanel from './InstantDossierPanel.jsx';
export default function DossierDrawerHost({ selectedProviderId, instantDossierById, deepDiveById, runDeepDive }){
  const dossier = React.useMemo(()=> selectedProviderId? (instantDossierById?.[selectedProviderId] ?? null): null, [selectedProviderId, instantDossierById]);
  const deepDive = React.useMemo(()=> selectedProviderId? (deepDiveById?.[selectedProviderId] ?? null): null, [selectedProviderId, deepDiveById]);
  const [deepDiveState, setDeepDiveState] = React.useState({status:'idle'});
  const onRunDeepDive = async (providerId)=>{ try{ setDeepDiveState({status:'loading'}); await runDeepDive(providerId); setDeepDiveState({status:'success'});}catch(e){ setDeepDiveState({status:'error', error:e?.message||'Deep Dive failed.'}); } };
  if(!dossier){ return <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-600 bg-white">Select a college to see the overview.</div> }
  return <InstantDossierPanel dossier={dossier} deepDive={deepDive} deepDiveState={deepDiveState} onRunDeepDive={onRunDeepDive}/>;
}
