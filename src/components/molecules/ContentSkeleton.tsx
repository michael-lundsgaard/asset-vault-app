'use client';

import { Skeleton } from '@/components/atoms/Skeleton';

export function GridSkeleton() {
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{Array.from({ length: 8 }).map((_, i) => (
				<div key={i} className="card overflow-hidden">
					<Skeleton className="h-44 rounded-none" />
					<div className="p-4 space-y-2">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-3 w-1/2" />
					</div>
				</div>
			))}
		</div>
	);
}

export function ListSkeleton() {
	return (
		<div className="card divide-y divide-[var(--border)]">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="flex items-center gap-4 px-5 py-4">
					<Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
					<Skeleton className="h-4 flex-1" />
					<Skeleton className="h-3 w-24" />
					<Skeleton className="h-6 w-16 rounded-xl" />
				</div>
			))}
		</div>
	);
}
