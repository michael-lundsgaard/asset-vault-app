'use client';

import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { LoginForm } from '@/components/organisms/LoginForm';

export default function LoginPage() {
	return (
		<div className="relative min-h-screen flex items-center justify-center bg-[var(--bg)] overflow-hidden px-4">
			{/* Decorative blobs */}
			<div className="glow-blob w-96 h-96 bg-brand-400 -top-24 -left-24 dark:opacity-20 opacity-15" />
			<div className="glow-blob w-80 h-80 bg-violet-500 bottom-0 right-0 dark:opacity-20 opacity-10" />

			{/* Theme toggle top-right */}
			<div className="absolute top-5 right-5">
				<ThemeToggle />
			</div>

			<LoginForm />
		</div>
	);
}
