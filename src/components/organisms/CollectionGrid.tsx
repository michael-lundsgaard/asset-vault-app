'use client';

import { CollectionResponse } from '@/api/generated';
import { CollectionCard } from '@/components/molecules/CollectionCard';
import { CollectionRow } from '@/components/molecules/CollectionRow';
import { GridSkeleton, ListSkeleton } from '@/components/molecules/ContentSkeleton';
import { InfiniteScrollFooter } from '@/components/molecules/InfiniteScrollFooter';
import { InfiniteScrollProps, ViewMode } from '@/types';
import { Inbox } from 'lucide-react';

export function CollectionGrid({
	collections,
	isLoading,
	viewMode,
	onDelete,
	infiniteScroll,
}: {
	collections?: CollectionResponse[];
	isLoading?: boolean;
	viewMode: ViewMode;
	onDelete?: (id: string) => void;
	infiniteScroll?: InfiniteScrollProps;
}) {
	if (isLoading) return viewMode === 'grid' ? <GridSkeleton /> : <ListSkeleton />;

	if (!collections?.length) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-28 text-[var(--subtle)]">
				<div className="w-16 h-16 rounded-3xl bg-[var(--card)] flex items-center justify-center">
					<Inbox className="w-7 h-7 opacity-50" />
				</div>
				<p className="text-sm font-medium">No collections yet</p>
			</div>
		);
	}

	if (viewMode === 'list') {
		return (
			<>
				<div className="card divide-y divide-[var(--border)]">
					{collections.map((c, i) => (
						<CollectionRow key={c.id} collection={c} index={i} onDelete={onDelete} />
					))}
				</div>
				{infiniteScroll && <InfiniteScrollFooter {...infiniteScroll} />}
			</>
		);
	}

	return (
		<>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{collections.map((c, i) => (
					<CollectionCard key={c.id} collection={c} index={i} onDelete={onDelete} />
				))}
			</div>
			{infiniteScroll && <InfiniteScrollFooter {...infiniteScroll} />}
		</>
	);
}
