'use client';
import { useAuthStore } from '@/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PUBLIC_ROUTES = ['/login'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
	const { user, loading, init } = useAuthStore();
	const router = useRouter();
	const pathname = usePathname();

	// Boot Supabase auth listener once
	useEffect(() => {
		let unsub: (() => void) | undefined;
		init().then((fn) => {
			unsub = fn;
		});
		return () => unsub?.();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Redirect logic
	useEffect(() => {
		if (loading) return;
		const isPublic = PUBLIC_ROUTES.includes(pathname);
		if (!user && !isPublic) router.replace('/login');
		if (user && isPublic) router.replace('/');
	}, [user, loading, pathname, router]);

	// Show nothing while checking session on protected pages
	if (loading && !PUBLIC_ROUTES.includes(pathname)) {
		return (
			<div className="flex items-center justify-center h-screen bg-[var(--bg)]">
				<div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return <>{children}</>;
}
