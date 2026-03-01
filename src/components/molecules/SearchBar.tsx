'use client';

import { Input } from '@/components/atoms/Input';
import { Search } from 'lucide-react';

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<Input
			icon={<Search className="w-4 h-4" />}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder="Search assets…"
			className="w-72"
		/>
	);
}
