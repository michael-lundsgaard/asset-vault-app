'use client';

import { cn } from '@/lib/utils';
import type { UploadState } from '@/types';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

const labels: Record<UploadState['status'], string> = {
	idle: 'Preparing…',
	initiating: 'Creating record…',
	uploading: 'Uploading…',
	confirming: 'Confirming…',
	done: 'Complete!',
	error: 'Failed',
};

export function UploadProgress({ state }: { state: UploadState }) {
	const isDone = state.status === 'done';
	const isError = state.status === 'error';

	return (
		<div className="card p-4 space-y-3">
			<div className="flex items-center gap-3">
				{isDone ? (
					<CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
				) : isError ? (
					<XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
				) : (
					<Loader2 className="w-4 h-4 text-brand-400 flex-shrink-0 animate-spin" />
				)}
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium text-[var(--text)] truncate">{state.displayName}</p>
					<p className={cn('text-xs', isError ? 'text-red-400' : 'text-[var(--subtle)]')}>
						{isError ? state.error : labels[state.status]}
					</p>
				</div>
				{!isDone && !isError && (
					<span className="text-xs font-mono text-[var(--subtle)]">{state.progress}%</span>
				)}
			</div>
			{!isError && (
				<div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
					<div
						className={cn(
							'h-full rounded-full transition-all duration-300',
							isDone ? 'bg-emerald-400' : 'bg-brand-400'
						)}
						style={{ width: `${state.progress}%` }}
					/>
				</div>
			)}
		</div>
	);
}
