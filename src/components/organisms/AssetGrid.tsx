'use client';

import type { AssetResponse } from '@/api/generated/types.gen';
import { Skeleton } from '@/components/atoms/Skeleton';
import { AssetCard } from '@/components/molecules/AssetCard';
import { AssetRow } from '@/components/molecules/AssetRow';
import type { ViewMode } from '@/types';
import { Inbox } from 'lucide-react';

function GridSkeleton() {
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

function ListSkeleton() {
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

export function AssetGrid({
	assets,
	isLoading,
	viewMode,
	onDelete,
}: {
	assets?: AssetResponse[];
	isLoading?: boolean;
	viewMode: ViewMode;
	onDelete?: (id: string) => void;
}) {
	if (isLoading) return viewMode === 'grid' ? <GridSkeleton /> : <ListSkeleton />;

	if (!assets?.length) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-28 text-[var(--subtle)]">
				<div className="w-16 h-16 rounded-3xl bg-[var(--card)] flex items-center justify-center">
					<Inbox className="w-7 h-7 opacity-50" />
				</div>
				<p className="text-sm font-medium">No assets yet</p>
			</div>
		);
	}

	if (viewMode === 'list') {
		return (
			<div className="card divide-y divide-[var(--border)]">
				{assets.map((a, i) => (
					<AssetRow key={a.id} asset={a} index={i} onDelete={onDelete} />
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{assets.map((a, i) => (
				<AssetCard key={a.id} asset={a} index={i} />
			))}
		</div>
	);
}
