
import React from 'react';import clsx from 'clsx';
export function Alert({className,variant='default',...p}){const v={default:'border-slate-200 bg-white',destructive:'border-red-200 bg-red-50'};return <div className={clsx('rounded-xl border p-3',v[variant],className)} {...p}/>} 
export function AlertTitle({className,...p}){return <div className={clsx('text-sm font-semibold',className)} {...p}/>} 
export function AlertDescription({className,...p}){return <div className={clsx('text-sm text-slate-700 mt-1',className)} {...p}/>}
