'use client';

import type { AssetResponse } from '@/api/generated/types.gen';
import { AssetCard } from '@/components/molecules/AssetCard';
import { AssetRow } from '@/components/molecules/AssetRow';
import { GridSkeleton, ListSkeleton } from '@/components/molecules/ContentSkeleton';
import { InfiniteScrollFooter } from '@/components/molecules/InfiniteScrollFooter';
import type { InfiniteScrollProps, ViewMode } from '@/types';
import { Inbox } from 'lucide-react';

export function AssetGrid({
	assets,
	isLoading,
	viewMode,
	onDelete,
	infiniteScroll,
	allowAddToCollection = true,
}: {
	assets?: AssetResponse[];
	isLoading?: boolean;
	viewMode: ViewMode;
	onDelete?: (id: string) => void;
	infiniteScroll?: InfiniteScrollProps;
	allowAddToCollection?: boolean;
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
			<>
				<div className="card divide-y divide-[var(--border)]">
					{assets.map((a, i) => (
						<AssetRow
							key={a.id}
							asset={a}
							index={i}
							onDelete={onDelete}
							allowAddToCollection={allowAddToCollection}
						/>
					))}
				</div>
				{infiniteScroll && <InfiniteScrollFooter {...infiniteScroll} />}
			</>
		);
	}

	return (
		<>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{assets.map((a, i) => (
					<AssetCard
						key={a.id}
						asset={a}
						index={i}
						onDelete={onDelete}
						allowAddToCollection={allowAddToCollection}
					/>
				))}
			</div>
			{infiniteScroll && <InfiniteScrollFooter {...infiniteScroll} />}
		</>
	);
}
