'use client';

import { useAuthStore } from '@/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '../atoms/Spinner';

const PUBLIC_ROUTES = ['/login', '/set-password'];

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
		if (user && !user.user_metadata?.password_set && pathname !== '/set-password') router.replace('/set-password');
		if (user && user.user_metadata?.password_set && pathname === '/set-password') router.replace('/');
		if (user && pathname === '/login') router.replace('/');
	}, [user, loading, pathname, router]);

	const isPublic = PUBLIC_ROUTES.includes(pathname);

	if (loading) return <Spinner />;
	if (isPublic && !user) return <>{children}</>;
	if (!isPublic && !user) return <Spinner />;

	// User exists but redirect is needed — hold while router.replace fires
	const redirectPending =
		(user && !user.user_metadata?.password_set && pathname !== '/set-password') ||
		(user && user.user_metadata?.password_set && pathname === '/set-password') ||
		(user && isPublic);

	if (redirectPending) return <Spinner />;

	return <>{children}</>;
}
