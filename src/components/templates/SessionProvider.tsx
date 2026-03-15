'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { Spinner } from '../atoms/Spinner';

export function SessionProvider({ children }: { children: React.ReactNode }) {
	const { loading, init } = useAuthStore();

	useEffect(() => {
		let unsub: (() => void) | undefined;
		init().then((fn) => {
			unsub = fn;
		});
		return () => unsub?.();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (loading) return <Spinner />;
	return <>{children}</>;
}
