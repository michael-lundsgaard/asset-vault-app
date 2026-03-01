'use client';

import { Button } from '@/components/atoms/Button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
	label?: string;
}

export function BackButton({ label = 'Back' }: BackButtonProps) {
	const router = useRouter();

	return (
		<Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4 -ml-1">
			<ArrowLeft className="w-4 h-4" />
			{label}
		</Button>
	);
}
