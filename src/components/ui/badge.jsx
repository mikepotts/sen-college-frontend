
import React from 'react';import clsx from 'clsx';
export function Badge({className,variant='secondary',...p}){
  const v={secondary:'bg-slate-100 text-slate-900',outline:'border border-slate-200 text-slate-700'};
  return <span className={clsx('inline-flex items-center rounded-xl px-2 py-0.5 text-xs font-medium',v[variant],className)} {...p}/>
}
