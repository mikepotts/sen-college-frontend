import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";
import { Separator } from "./ui/separator.jsx";
import { ScrollArea } from "./ui/scroll-area.jsx";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "./ui/alert.jsx";
import {
  ExternalLink,
  Sparkles,
  Loader2,
  Info,
  Mail,
  Phone,
  Calendar,
  Link2,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";

import { buildContactsClipboardText } from "./utils/copyContacts.js";

export default function InstantDossierPanel({
  dossier,
  deepDive,
  deepDiveState,
  onRunDeepDive,
}) {
  const status = deepDiveState?.status ?? "idle";

  const [expanded, setExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [newPulse, setNewPulse] = React.useState(false);

  React.useEffect(() => {
    setExpanded(false);
    setCopied(false);
    setNewPulse(false);
  }, [dossier?.provider?.provider_id]);

  React.useEffect(() => {
    if (status === "success" && deepDive && !expanded) {
      setNewPulse(true);
      const t = setTimeout(() => setNewPulse(false), 6000);
      return () => clearTimeout(t);
    }
  }, [status, deepDive, expanded]);

  function relativeTime(timestamp) {
    if (!timestamp) return null;
    const then = new Date(timestamp).getTime();
    const now = Date.now();

    const diffSeconds = Math.round((now - then) / 1000);
    if (diffSeconds < 0) return "just now";

    const units = [
      ["day", 86400],
      ["hour", 3600],
      ["minute", 60],
      ["second", 1],
    ];

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    for (const [name, seconds] of units) {
      const value = Math.floor(diffSeconds / seconds);
      if (value >= 1) return rtf.format(-value, name);
    }

    return "just now";
  }

  async function copyContacts() {
    if (!deepDive?.contacts_found?.length) return;

    const text = buildContactsClipboardText(deepDive.contacts_found);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  }

  const updatedLabel = deepDive?.generated_at
    ? `Updated ${relativeTime(deepDive.generated_at)}`
    : null;

  const PrimaryLink = ({ label, url }) => (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
    >
      <Link2 className="h-4 w-4" />
      {label}
      <ExternalLink className="h-3.5 w-3.5 opacity-70" />
    </a>
  );

  return (
    <Card className="rounded-2xl shadow-sm border border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="text-xl font-semibold truncate">
              College Overview
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              {dossier?.provider?.name ?? "Selected provider"}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {/* Display match_reasons as badges if available */}
              {(dossier?.match_reasons ?? []).map((reason, idx) => (
                <Badge key={idx} variant="default" className="rounded-xl bg-blue-100 text-blue-800 border-blue-200">
                  {reason}
                </Badge>
              ))}

              {/* Legacy badges */}
              {(dossier?.badges ?? []).map((b) => (
                <Badge key={b} variant="secondary" className="rounded-xl">
                  {b}
                </Badge>
              ))}

              {typeof dossier?.distance_miles === "number" && (
                <Badge variant="outline" className="rounded-xl">
                  {dossier.distance_miles.toFixed(1)} miles away
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge className="rounded-xl" variant="outline">
              Score:{" "}
              {typeof dossier?.score === "number"
                ? dossier.score.toFixed(3)
                : "—"}
            </Badge>
            <span className="text-xs text-slate-500">
              SEND-first ranking (default)
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="h-[520px] pr-3">
          {/* Short Overview */}
          <section className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-slate-600" />
              <h3 className="font-semibold text-base">Short overview</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {dossier?.quick_summary ||
                "This summary gives you the key information about this college."}
            </p>
          </section>

          <Separator className="my-4" />

          {/* Inferred Intent - NEW for GenAI matching */}
          {dossier?.inferred_intent && (
            <>
              <section className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-slate-600" />
                  <h3 className="font-semibold text-base">What we understood from your search</h3>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  {dossier.inferred_intent.residential && (
                    <div className="text-sm text-slate-700 mb-2">
                      <span className="font-medium">Residential:</span>{" "}
                      <span className="capitalize">{dossier.inferred_intent.residential}</span>
                    </div>
                  )}
                  {dossier.inferred_intent.vocational_areas?.length > 0 && (
                    <div className="text-sm text-slate-700 mb-2">
                      <span className="font-medium">Vocational interests:</span>{" "}
                      {dossier.inferred_intent.vocational_areas.map(v => v.replace(/_/g, ' ')).join(', ')}
                    </div>
                  )}
                  {dossier.inferred_intent.send_needs?.length > 0 && (
                    <div className="text-sm text-slate-700 mb-2">
                      <span className="font-medium">SEND needs:</span>{" "}
                      {dossier.inferred_intent.send_needs.map(s => s.replace(/_/g, ' ')).join(', ')}
                    </div>
                  )}
                  {dossier.inferred_intent.target_settings?.length > 0 && (
                    <div className="text-sm text-slate-700">
                      <span className="font-medium">Looking for:</span>{" "}
                      {dossier.inferred_intent.target_settings.map(s => s.replace(/_/g, ' ')).join(', ')}
                    </div>
                  )}
                </div>
              </section>

              <Separator className="my-4" />
            </>
          )}

          {/* Why it matches */}
          <section className="mb-5">
            <h3 className="font-semibold text-base mb-2">
              Why this college may suit your young person
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              This match is based on your search and the provider's characteristics.
            </p>

            <ul className="space-y-2">
              {(dossier?.why_it_matches ?? []).map((text, idx) => (
                <li
                  key={idx}
                  className="text-sm text-slate-700 flex gap-2 leading-snug"
                >
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}

              {(!dossier?.why_it_matches ||
                dossier.why_it_matches.length === 0) && (
                <li className="text-sm text-slate-500">
                  No match details available yet.
                </li>
              )}
            </ul>
          </section>

          <Separator className="my-4" />

          {/* Quick Links */}
          <section className="mb-5">
            <h3 className="font-semibold text-base mb-2">Quick links</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(dossier?.key_links ?? []).map((l) => (
                <PrimaryLink key={l.label} label={l.label} url={l.url} />
              ))}

              {(!dossier?.key_links || dossier.key_links.length === 0) && (
                <p className="text-sm text-slate-500">No links available.</p>
              )}
            </div>
          </section>

          <Separator className="my-4" />

          {/* Who to contact */}
          <section className="mb-5">
            <h3 className="font-semibold text-base mb-2">Who to speak to</h3>

            <p className="text-sm text-slate-600 mb-3">
              Most families start with the SEND/Inclusive Learning team.
            </p>

            <div className="space-y-3">
              {(dossier?.who_to_contact ?? []).map((c, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 p-3"
                >
                  <p className="text-sm font-medium text-slate-800">
                    {c.role}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{c.suggestion}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator className="my-4" />

          {/* Open days */}
          <section className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-slate-600" />
              <h3 className="font-semibold text-base">Open days & events</h3>
            </div>

            <p className="text-sm text-slate-600 mb-3">
              View upcoming open events.
            </p>

            {dossier?.open_days_hint?.link ? (
              <PrimaryLink
                label="View open days"
                url={dossier.open_days_hint.link}
              />
            ) : (
              <p className="text-sm text-slate-500">No open-day link found.</p>
            )}
          </section>

          <Separator className="my-4" />

          {/* Deep Dive */}
          <section className="mb-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-slate-700" />
                  <h3 className="font-semibold text-base">Need more detail?</h3>
                </div>

                <p className="text-sm text-slate-600">
                  Run a Deep Dive to extract named contacts, open day dates,
                  SEND/course detail, and more.
                </p>
              </div>

              <Button
                className="rounded-xl"
                onClick={() =>
                  onRunDeepDive?.(dossier.provider.provider_id)
                }
                disabled={!dossier?.provider?.provider_id || status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Collecting…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Run Deep Dive
                  </>
                )}
              </Button>
            </div>

            {status === "error" && (
              <Alert className="mt-4 rounded-xl" variant="destructive">
                <AlertTitle>Deep Dive failed</AlertTitle>
                <AlertDescription>
                  We couldn’t complete the Deep Dive. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {status === "success" && deepDive && (
              <div className="mt-4 rounded-2xl border border-slate-200 overflow-hidden">
                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setExpanded((v) => !v);
                    setNewPulse(false);
                  }}
                  className="w-full flex items-center justify-between gap-3 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-left">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-xl bg-slate-100 relative">
                      <Sparkles className="h-4 w-4 text-slate-700" />
                      {newPulse && (
                        <span className="absolute -top-1 -right-1">
                          {/* New pulse */}
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inset-0 inline-flex rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                          </span>
                        </span>
                      )}
                    </span>

                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-slate-900">
                        Deep Dive ready
                      </span>
                      {updatedLabel && (
                        <span className="text-xs text-slate-500">
                          {updatedLabel}
                        </span>
                      )}
                    </div>

                    {newPulse && (
                      <Badge
                        variant="secondary"
                        className="rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100"
                      >
                        New
                      </Badge>
                    )}
                  </div>

                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-slate-200 bg-white">
                    {expanded ? (
                      <ChevronDown className="h-4 w-4 text-slate-700" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-700" />
                    )}
                  </span>
                </button>

                {expanded && (
                  <div className="px-4 pb-4">
                    <Separator className="my-3" />

                    {/* Contacts */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <p className="text-sm font-medium text-slate-800">
                        Key contacts
                      </p>

                      <Button
                        variant="outline"
                        className="rounded-xl"
                        disabled={
                          !deepDive.contacts_found.some(
                            (c) => c.email || c.phone
                          )
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          copyContacts();
                        }}
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copied ? "Copied" : "Copy contacts"}
                      </Button>
                    </div>

                    <div className="space-y-2 mb-5">
                      {deepDive.contacts_found.map((c, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 rounded-xl p-3 flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {c.role || "Contact"}
                            </p>

                            <div className="text-sm text-slate-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                              {c.email && (
                                <span className="inline-flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  {c.email}
                                </span>
                              )}

                              {c.phone && (
                                <span className="inline-flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {c.phone}
                                </span>
                              )}
                            </div>
                          </div>

                          {c.source_url && (
                            <a
                              href={c.source_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                              source
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Open Days */}
                    <div className="mb-5">
                      <p className="text-sm font-medium text-slate-800 mb-2">
                        Open days
                      </p>

                      <div className="space-y-2">
                        {deepDive.open_days.map((event, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-slate-200 p-3"
                          >
                            <p className="text-sm font-medium">
                              {event.type || "Open Event"}{" "}
                              <span className="text-slate-500 font-normal">
                                {event.notes || ""}
                              </span>
                            </p>

                            {event.booking_url && (
                              <a
                                href={event.booking_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-2 mt-1"
                              >
                                Book / details{" "}
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="mb-2">
                      <p className="text-sm font-medium text-slate-800 mb-2">
                        Questions to ask
                      </p>

                      <ul className="space-y-2">
                        {deepDive.questions_to_ask.map((q, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-slate-700 flex gap-2"
                          >
                            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}