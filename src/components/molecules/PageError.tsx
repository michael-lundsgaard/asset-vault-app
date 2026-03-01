'use client';

import { Button } from '@/components/atoms/Button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageErrorProps {
	message?: string;
}

export function PageError({ message = 'Something went wrong' }: PageErrorProps) {
	const router = useRouter();

	return (
		<div className="flex flex-col items-center justify-center h-96 gap-4 text-[var(--subtle)]">
			<p className="text-lg font-medium">{message}</p>
			<Button variant="ghost" size="sm" onClick={() => router.back()}>
				<ArrowLeft className="w-4 h-4" />
				Go back
			</Button>
		</div>
	);
}
