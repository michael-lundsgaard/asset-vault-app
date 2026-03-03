'use client';

import { assetsGetAllInfiniteOptions } from '@/api/generated/@tanstack/react-query.gen';
import { Button } from '@/components/atoms/Button';
import { SearchBar } from '@/components/molecules/SearchBar';
import { ViewToggle } from '@/components/molecules/ViewToggle';
import { AssetGrid } from '@/components/organisms/AssetGrid';
import { Header } from '@/components/organisms/Header';
import { UploadPanel } from '@/components/organisms/UploadPanel';
import { AppLayout } from '@/components/templates/AppLayout';
import { useDebounce } from '@/hooks/useDebounce';
import { useUIStore } from '@/store/uiStore';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import { useState } from 'react';

export default function AssetsPage() {
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search);
	const { viewMode, setViewMode, uploadPanelOpen, setUploadPanelOpen } = useUIStore();

	const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
		...assetsGetAllInfiniteOptions({ query: { search: debouncedSearch || undefined, pageSize: 24 } }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
	});

	const assets = data?.pages.flatMap((p) => p.items) ?? [];

	return (
		<AppLayout>
			<Header
				title="Assets"
				subtitle="Manage your assets here"
				actions={
					<Button onClick={() => setUploadPanelOpen(!uploadPanelOpen)}>
						<Upload className="w-4 h-4" />
						Upload
					</Button>
				}
			/>

			{uploadPanelOpen && (
				<div className="mb-8">
					<UploadPanel onClose={() => setUploadPanelOpen(false)} />
				</div>
			)}

			<div className="flex items-center justify-between gap-4 mb-5">
				<SearchBar value={search} onChange={setSearch} />
				<ViewToggle value={viewMode} onChange={setViewMode} />
			</div>

			<AssetGrid
				assets={assets}
				isLoading={isLoading}
				viewMode={viewMode}
				infiniteScroll={{ hasNextPage, isFetchingNextPage, onLoadMore: fetchNextPage }}
			/>
		</AppLayout>
	);
}
