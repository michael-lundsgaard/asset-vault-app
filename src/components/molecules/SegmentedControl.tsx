'use client';

import { cn } from '@/lib/utils';

interface Option<T extends string> {
	value: T;
	label: string;
}

interface SegmentedControlProps<T extends string> {
	value: T;
	onChange: (value: T) => void;
	options: Option<T>[];
}

export function SegmentedControl<T extends string>({ value, onChange, options }: SegmentedControlProps<T>) {
	return (
		<div className="flex items-center gap-1 p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
			{options.map((option) => (
				<button
					key={option.value}
					onClick={() => onChange(option.value)}
					className={cn(
						'px-4 h-8 text-sm font-medium rounded-xl transition-all capitalize',
						value === option.value
							? 'bg-brand-400 text-white shadow-glow-sm'
							: 'text-[var(--subtle)] hover:text-[var(--text)]'
					)}
				>
					{option.label}
				</button>
			))}
		</div>
	);
}
