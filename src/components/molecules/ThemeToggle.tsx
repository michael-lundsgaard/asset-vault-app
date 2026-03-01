'use client';

import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/themeStore';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle({ className }: { className?: string }) {
	const { theme, toggleTheme } = useThemeStore();

	return (
		<button
			onClick={toggleTheme}
			aria-label="Toggle theme"
			className={cn(
				'w-9 h-9 flex items-center justify-center rounded-2xl border border-[var(--border)]',
				'text-[var(--subtle)] hover:text-[var(--text)] hover:border-[var(--muted)] transition-all',
				className
			)}
		>
			{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
		</button>
	);
}
