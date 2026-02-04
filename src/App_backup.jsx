
import React from "react";
import DossierDrawerHost from "./components/DossierDrawerHost.jsx";
import { API_BASE } from "./lib/config.js";

export default function App(){
  const [providers, setProviders] = React.useState([]);
  const [instantById, setInstantById] = React.useState({});
  const [selectedProviderId, setSelectedProviderId] = React.useState(null);
  const [deepDiveById, setDeepDiveById] = React.useState({});

  React.useEffect(()=>{ (async()=>{ try{ const res=await fetch(`${API_BASE}/instant?postcode=LS1%201AA&target_count=10`); const data=await res.json(); const ids=data.instant_dossiers.map(d=>d.provider.provider_id); setProviders(data.instant_dossiers.map(d=>({provider_id:d.provider.provider_id, name:d.provider.name}))); const map={}; for(const d of data.instant_dossiers){ map[d.provider.provider_id]=d;} setInstantById(map); if(ids.length) setSelectedProviderId(ids[0]); }catch(e){ console.error(e);} })(); },[]);

  async function runDeepDive(providerId){ try{ const res=await fetch(`${API_BASE}/deep-dive`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ provider_id: providerId }) }); const payload=await res.json(); setDeepDiveById(prev=>({...prev,[providerId]:payload})); return payload; }catch(e){ console.error(e); throw e; } }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h1 className="text-lg font-semibold">Providers</h1>
            <p className="text-sm text-slate-600 mt-1">Select one provider to view the dossier.</p>
            <div className="mt-4 space-y-2">
              {providers.map(p=> (
                <button key={p.provider_id} onClick={()=>setSelectedProviderId(p.provider_id)} className={"w-full text-left rounded-xl border p-3 transition-colors "+ (selectedProviderId===p.provider_id? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50") }>
                  <div className="font-medium">{p.name}</div>
                  <div className={"text-xs mt-1 "+(selectedProviderId===p.provider_id? "text-white/80":"text-slate-500")}>Click to view</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <DossierDrawerHost selectedProviderId={selectedProviderId} instantDossierById={instantById} deepDiveById={deepDiveById} runDeepDive={runDeepDive} />
        </div>
      </div>
    </div>
  );
}
