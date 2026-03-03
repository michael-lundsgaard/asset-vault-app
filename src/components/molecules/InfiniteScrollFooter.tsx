'use client';

import { ScrollSentinel } from '@/components/atoms/ScrollSentinel';
import type { InfiniteScrollProps } from '@/types';

export function InfiniteScrollFooter({ hasNextPage, isFetchingNextPage, onLoadMore }: InfiniteScrollProps) {
	return (
		<div className="mt-4 flex justify-center">
			{isFetchingNextPage && (
				<div className="w-5 h-5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
			)}
			<ScrollSentinel onIntersect={onLoadMore} enabled={!!hasNextPage && !isFetchingNextPage} />
		</div>
	);
}
