'use client';

import '@/api/client'; // registers auth interceptors on the generated client singleton
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LazyMotion, domAnimation } from 'framer-motion';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
	const [qc] = useState(
		() =>
			new QueryClient({
				defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
			})
	);
	return (
		<QueryClientProvider client={qc}>
			<LazyMotion features={domAnimation}>{children}</LazyMotion>
		</QueryClientProvider>
	);
}
