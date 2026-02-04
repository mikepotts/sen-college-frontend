
import React from 'react';import clsx from 'clsx';
export function Button({className,variant='default',disabled,...p}){
  const base='inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors';
  const v={default:'bg-slate-900 text-white hover:bg-slate-800',outline:'border border-slate-200 bg-white hover:bg-slate-50',secondary:'bg-slate-100 text-slate-900 hover:bg-slate-200',destructive:'bg-red-600 text-white hover:bg-red-700'};
  return <button className={clsx(base,v[variant],'rounded-xl',disabled&&'opacity-50 cursor-not-allowed',className)} disabled={disabled}{...p}/>}
