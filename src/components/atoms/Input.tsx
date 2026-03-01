import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	icon?: React.ReactNode;
	label?: string;
	error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ icon, label, error, className, ...props }, ref) => (
	<div className="space-y-1.5 w-full">
		{label && (
			<label className="text-xs font-semibold text-[var(--subtle)] uppercase tracking-wider">{label}</label>
		)}
		<div className="relative flex items-center">
			{icon && <span className="absolute left-4 text-[var(--subtle)] pointer-events-none">{icon}</span>}
			<input
				ref={ref}
				className={cn(
					'h-11 w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm placeholder:text-[var(--subtle)] rounded-2xl transition-all',
					'focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20',
					icon ? 'pl-11 pr-4' : 'px-4',
					error && 'border-red-500/60',
					className
				)}
				{...props}
			/>
		</div>
		{error && <p className="text-xs text-red-400">{error}</p>}
	</div>
));

Input.displayName = 'Input';
