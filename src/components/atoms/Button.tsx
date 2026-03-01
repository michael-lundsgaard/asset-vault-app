'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'ghost' | 'danger' | 'outline' | 'soft';
	size?: 'sm' | 'md' | 'lg';
	loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
		const base =
			'inline-flex items-center justify-center gap-2 font-body font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed select-none rounded-2xl';

		const variants = {
			primary: 'bg-brand-400 text-white hover:bg-brand-500 active:scale-[0.97] shadow-glow-sm hover:shadow-glow',
			soft: 'bg-brand-400/15 text-brand-400 hover:bg-brand-400/25 active:scale-[0.97]',
			ghost: 'text-[var(--subtle)] hover:text-[var(--text)] hover:bg-[var(--border)] active:scale-[0.97]',
			danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 active:scale-[0.97]',
			outline: 'border border-[var(--border)] text-[var(--text)] hover:border-[var(--muted)] active:scale-[0.97]',
		};

		const sizes = {
			sm: 'h-8  px-3.5 text-xs',
			md: 'h-10 px-5   text-sm',
			lg: 'h-12 px-7   text-base',
		};

		return (
			<button
				ref={ref}
				disabled={disabled || loading}
				className={cn(base, variants[variant], sizes[size], className)}
				{...props}
			>
				{loading && (
					<span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
				)}
				{children}
			</button>
		);
	}
);
Button.displayName = 'Button';
