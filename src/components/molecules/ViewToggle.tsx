'use client';

import { cn } from '@/lib/utils';
import type { ViewMode } from '@/types';
import { LayoutGrid, List } from 'lucide-react';

export function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
	return (
		<div className="flex items-center gap-1 p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
			{(['grid', 'list'] as ViewMode[]).map((mode) => (
				<button
					key={mode}
					onClick={() => onChange(mode)}
					className={cn(
						'w-8 h-8 flex items-center justify-center rounded-xl transition-all',
						value === mode
							? 'bg-brand-400 text-white shadow-glow-sm'
							: 'text-[var(--subtle)] hover:text-[var(--text)]'
					)}
				>
					{mode === 'grid' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
				</button>
			))}
		</div>
	);
}
