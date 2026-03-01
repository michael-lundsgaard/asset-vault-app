'use client';

import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { SetPasswordForm } from '@/components/organisms/SetPasswordForm';

export default function SetPasswordPage() {
	return (
		<div className="relative min-h-screen flex items-center justify-center bg-[var(--bg)] overflow-hidden px-4">
			<div className="glow-blob w-96 h-96 bg-brand-400 -top-24 -left-24 dark:opacity-20 opacity-15" />
			<div className="glow-blob w-80 h-80 bg-violet-500 bottom-0 right-0 dark:opacity-20 opacity-10" />

			<div className="absolute top-5 right-5">
				<ThemeToggle />
			</div>

			<SetPasswordForm />
		</div>
	);
}
