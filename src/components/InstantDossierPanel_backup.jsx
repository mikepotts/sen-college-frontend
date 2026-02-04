
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";
import { Separator } from "./ui/separator.jsx";
import { ScrollArea } from "./ui/scroll-area.jsx";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert.jsx";
import { ExternalLink, Sparkles, Loader2, Info, Mail, Phone, Calendar, Link2, ChevronDown, ChevronRight, Copy, Check } from "lucide-react";

export default function InstantDossierPanel({ dossier, deepDive, deepDiveState, onRunDeepDive }) {
  const status = deepDiveState?.status ?? "idle";
  const [isDeepDiveExpanded, setIsDeepDiveExpanded] = React.useState(false);
  const [showNewPulse, setShowNewPulse] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => { setIsDeepDiveExpanded(false); setCopied(false); setShowNewPulse(false); }, [dossier?.provider?.provider_id]);
  React.useEffect(() => { if (status === "success" && deepDive && !isDeepDiveExpanded) { setShowNewPulse(true); const t=setTimeout(()=>setShowNewPulse(false),6000); return ()=>clearTimeout(t);} }, [status, deepDive]);
  function formatRelativeTime(iso){ if(!iso) return null; const then=new Date(iso).getTime(), now=Date.now(); if(Number.isNaN(then)) return null; const diffSec=Math.round((now-then)/1000); if(diffSec<0) return 'just now'; const units=[{name:'day',seconds:86400},{name:'hour',seconds:3600},{name:'minute',seconds:60},{name:'second',seconds:1}]; const rtf=new Intl.RelativeTimeFormat('en',{numeric:'auto'}); for(const u of units){ const v=Math.floor(diffSec/u.seconds); if(v>=1) return rtf.format(-v,u.name);} return 'just now'; }
  const updatedLabel = deepDive?.generated_at ? `Updated ${formatRelativeTime(deepDive.generated_at)}` : null;
  const PrimaryLink = ({label,url}) => (<a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"><Link2 className="h-4 w-4"/>{label}<ExternalLink className="h-3.5 w-3.5 opacity-70"/></a>);

async function copyContacts() {
	 if (!deepDive?.contacts_found?.length) return;
	 const emails = [...new Set(
		    deepDive.contacts_found.map(c => c.email).filter(Boolean)
		  )];
	 const phones = [...new Set(
		    deepDive.contacts_found.map(c => c.phone).filter(Boolean)
		  )];
	 // Build a plain text clipboard string safely
	 let txt = '';
	 if (emails.length) {
	    txt += `Emails:\n- ${emails.join('\n- ')}\n\n`;
	     }
	 if (phones.length) {
	    txt += `Phones:\n- ${phones.join('\n- ')}`;
	     }
	 try {
	     await navigator.clipboard.writeText(txt.trim());
	     setCopied(true);
	     setTimeout(() => setCopied(false), 2500);
	 } catch {}
	}

return (
    <Card className="rounded-2xl shadow-sm border border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="text-xl font-semibold truncate">College Overview</CardTitle>
            <p className="text-sm text-slate-600 mt-1">{dossier?.provider?.name ?? 'Selected provider'}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {(dossier?.badges ?? []).map(b=> <Badge key={b} variant="secondary" className="rounded-xl">{b}</Badge>)}
              {typeof dossier?.distance_miles === 'number' && (<Badge variant="outline" className="rounded-xl">{dossier.distance_miles.toFixed(1)} miles away</Badge>)}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="rounded-xl" variant="outline">Score: {typeof dossier?.score==='number'? dossier.score.toFixed(3):'—'}</Badge>
            <span className="text-xs text-slate-500">SEND-first ranking (default)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[520px] pr-3">
          <section className="mb-5"><div className="flex items-center gap-2 mb-2"><Info className="h-4 w-4 text-slate-600"/><h3 className="font-semibold text-base">Short overview</h3></div><p className="text-sm text-slate-700 leading-relaxed">{dossier?.quick_summary || 'This summary gives you the key information about this college, including their course offer, SEND support and how to take the next step.'}</p></section>
          <Separator className="my-4"/>
          <section className="mb-5"><h3 className="font-semibold text-base mb-2">Why this college may suit your young person</h3><p className="text-sm text-slate-600 mb-3">This match is based on interests and support needs. SEND suitability is prioritised by default unless you change it.</p><ul className="space-y-2">{(dossier?.why_it_matches ?? []).map((t,i)=> <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0"/><span>{t}</span></li>)}{(!dossier?.why_it_matches || dossier.why_it_matches.length===0)&&(<li className="text-sm text-slate-500">No match details available yet.</li>)}</ul></section>
          <Separator className="my-4"/>
          <section className="mb-5"><h3 className="font-semibold text-base mb-2">Quick links</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{(dossier?.key_links ?? []).map(l=> <PrimaryLink key={l.label} label={l.label} url={l.url}/>)}{(!dossier?.key_links || dossier.key_links.length===0)&&(<p className="text-sm text-slate-500">No links available.</p>)}</div></section>
          <Separator className="my-4"/>
          <section className="mb-5"><h3 className="font-semibold text-base mb-2">Who to speak to</h3><p className="text-sm text-slate-600 mb-3">Most families start with the SEND/Inclusive Learning team to discuss EHCP support and adjustments, then admissions or course staff.</p><div className="space-y-3">{(dossier?.who_to_contact ?? []).map((c,i)=> <div key={i} className="rounded-xl border border-slate-200 p-3"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="text-sm font-medium text-slate-800 truncate">{c.role}</p><p className="text-sm text-slate-600 mt-1">{c.suggestion}</p></div><Badge variant="secondary" className="rounded-xl">Recommended</Badge></div></div>)}{(!dossier?.who_to_contact || dossier.who_to_contact.length===0)&&(<p className="text-sm text-slate-500">No contact guidance available yet. Use the provider’s contact page from Quick links.</p>)}</div></section>
          <Separator className="my-4"/>
          <section className="mb-5"><div className="flex items-center gap-2 mb-2"><Calendar className="h-4 w-4 text-slate-600"/><h3 className="font-semibold text-base">Open days & events</h3></div><p className="text-sm text-slate-600 mb-3">View upcoming open events. If your young person prefers a lower-sensory environment, look for quieter/SEND-friendly sessions.</p>{dossier?.open_days_hint?.link ? (<PrimaryLink label="View open days" url={dossier.open_days_hint.link}/>) : (<p className="text-sm text-slate-500">No open-day link found.</p>)}{!!dossier?.open_days_hint?.best_next_step && (<p className="text-sm text-slate-700 mt-3"><span className="font-medium">Next step:</span> {dossier.open_days_hint.best_next_step}</p>)}</section>
          <Separator className="my-4"/>
          <section className="mb-5">
            <div className="flex items-center justify-between gap-4">
              <div><div className="flex items-center gap-2 mb-1"><Sparkles className="h-4 w-4 text-slate-700"/><h3 className="font-semibold text-base">Need more detail?</h3></div><p className="text-sm text-slate-600">Run a Deep Dive to extract named contacts, specific open day dates and more SEND/course detail.</p></div>
              <Button className="rounded-xl" onClick={()=>onRunDeepDive?.(dossier.provider.provider_id)} disabled={!dossier?.provider?.provider_id || status==='loading'}>{status==='loading'? (<><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Collecting…</>):(<><Sparkles className="h-4 w-4"/>Run Deep Dive</>)}</Button>
            </div>
            {status==='error' && (<Alert className="mt-4 rounded-xl" variant="destructive"><AlertTitle>Deep Dive failed</AlertTitle><AlertDescription>We couldn’t complete the Deep Dive. Please try again later.</AlertDescription></Alert>)}
            {status==='success' && deepDive && (
              <div className="mt-4 rounded-2xl border border-slate-200 overflow-hidden">
                <button type="button" onClick={()=>{ setIsDeepDiveExpanded(v=>!v); setShowNewPulse(false); }} className="w-full flex items-center justify-between gap-3 p-4 hover:bg-slate-50 transition-colors" aria-expanded={isDeepDiveExpanded}>
                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-xl bg-slate-100 relative"><Sparkles className="h-4 w-4 text-slate-700"/>{showNewPulse && (<span className="absolute -top-1 -right-1"><span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span></span>)}</span>
                      <h4 className="font-semibold text-sm text-slate-900">Deep Dive ready</h4>
                      {updatedLabel && (<span className="text-xs text-slate-500">{updatedLabel}</span>)}
                      {showNewPulse && (<Badge variant="secondary" className="rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">New</Badge>)}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">Named contacts, open day dates, SEND detail and tailored questions.</p>
                  </div>
                  <div className="shrink-0 inline-flex items-center gap-2"><span className="text-sm font-medium text-slate-700">{isDeepDiveExpanded?'Hide':'Show'}</span><span className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-slate-200 bg-white">{isDeepDiveExpanded? (<ChevronDown className="h-4 w-4 text-slate-700"/>):(<ChevronRight className="h-4 w-4 text-slate-700"/>)}</span></div>
                </button>
                <div className={["grid transition-all duration-300 ease-out", isDeepDiveExpanded?"grid-rows-[1fr] opacity-100":"grid-rows-[0fr] opacity-0"].join(" ")}>
                  <div className="overflow-hidden px-4 pb-4">
                    <Separator className="mb-4"/>
                    <div className="flex items-center justify-between gap-3 mb-3"><p className="text-sm font-medium text-slate-800">Key contacts found</p><Button variant="outline" className="rounded-xl" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); copyContacts();}} disabled={!deepDive?.contacts_found?.some(c=>c.email||c.phone)} title="Copy emails and phone numbers">{copied? <Check className="h-4 w-4"/>:<Copy className="h-4 w-4"/>}{copied? 'Copied':'Copy contacts'}</Button></div>
                    <div className="space-y-2 mb-5">{(deepDive.contacts_found ?? []).slice(0,5).map((c,i)=> <div key={i} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"><div className="min-w-0"><p className="text-sm font-medium truncate">{c.role || 'Contact'}</p><div className="text-sm text-slate-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">{c.email && (<span className="inline-flex items-center gap-1"><Mail className="h-4 w-4"/>{c.email}</span>)}{c.phone && (<span className="inline-flex items-center gap-1"><Phone className="h-4 w-4"/>{c.phone}</span>)}</div></div>{c.source_url && (<a className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1" href={c.source_url} target="_blank" rel="noreferrer" onClick={(e)=>e.stopPropagation()}>source <ExternalLink className="h-3.5 w-3.5"/></a>)}</div>)}{(!deepDive.contacts_found || deepDive.contacts_found.length===0)&&(<p className="text-sm text-slate-500">No named contacts were extracted.</p>)}</div>
                    <div className="mb-5"><p className="text-sm font-medium text-slate-800 mb-2">Upcoming open days</p><div className="space-y-2">{(deepDive.open_days ?? []).slice(0,5).map((e,i)=> <div key={i} className="rounded-xl border border-slate-200 p-3"><p className="text-sm font-medium">{e.type || 'Open Event'} <span className="text-slate-500 font-normal">{e.date}{e.time? ` • ${e.time}`:''}</span></p>{e.booking_url && (<a href={e.booking_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-2 mt-1">Book / details <ExternalLink className="h-3.5 w-3.5"/></a>)}</div>)}{(!deepDive.open_days || deepDive.open_days.length===0)&&(<p className="text-sm text-slate-500">No open day dates were extracted.</p>)}</div>
                    <div className="mb-1"><p className="text-sm font-medium text-slate-800 mb-2">Questions to ask</p><ul className="space-y-2">{(deepDive.questions_to_ask ?? []).slice(0,10).map((q,i)=> <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0"/><span>{q}</span></li>)}{(!deepDive.questions_to_ask || deepDive.questions_to_ask.length===0)&&(<li className="text-sm text-slate-500">No suggested questions were generated.</li>)}</ul></div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
