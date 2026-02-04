
import React from 'react';import clsx from 'clsx';
export function Card({className,...p}){return <div className={clsx('bg-white',className)} {...p}/>}
export function CardHeader({className,...p}){return <div className={clsx('p-4',className)} {...p}/>}
export function CardTitle({className,...p}){return <h2 className={clsx('text-lg',className)} {...p}/>}
export function CardContent({className,...p}){return <div className={clsx('p-4',className)} {...p}/>}
