'use client';

import { assetsGetAllInfiniteOptions } from '@/api/generated/@tanstack/react-query.gen';
import { Button } from '@/components/atoms/Button';
import { SearchBar } from '@/components/molecules/SearchBar';
import { StatCard } from '@/components/molecules/StatCard';
import { ViewToggle } from '@/components/molecules/ViewToggle';
import { AssetGrid } from '@/components/organisms/AssetGrid';
import { Header } from '@/components/organisms/Header';
import { UploadPanel } from '@/components/organisms/UploadPanel';
import { useDebounce } from '@/hooks/useDebounce';
import { formatBytes } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CheckCircle2, HardDrive, Layers, Upload } from 'lucide-react';
import { useState } from 'react';
import { AppLayout } from './AppLayout';

export function DashboardTemplate() {
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search);
	const { viewMode, setViewMode, uploadPanelOpen, setUploadPanelOpen } = useUIStore();

	const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
		...assetsGetAllInfiniteOptions({ query: { search: debouncedSearch || undefined, pageSize: 24 } }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
	});

	const assets = data?.pages.flatMap((p) => p.items) ?? [];
	const totalAssets = data?.pages[0]?.total ?? 0;
	const totalSize = assets.reduce((s, a) => s + a.sizeBytes, 0);
	const active = assets.filter((a) => a.status === 'Active').length;
	const pending = assets.filter((a) => a.status === 'Pending').length;

	return (
		<AppLayout>
			<Header
				title="Dashboard"
				subtitle="Manage and preview your media assets"
				actions={
					<Button onClick={() => setUploadPanelOpen(!uploadPanelOpen)}>
						<Upload className="w-4 h-4" />
						Upload
					</Button>
				}
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<StatCard label="Total" value={totalAssets} icon={<Layers className="w-4 h-4" />} index={0} />
				<StatCard label="Active" value={active} icon={<CheckCircle2 className="w-4 h-4" />} index={1} />
				<StatCard
					label="Storage"
					value={formatBytes(totalSize)}
					icon={<HardDrive className="w-4 h-4" />}
					index={2}
				/>
				<StatCard label="Pending" value={pending} icon={<Upload className="w-4 h-4" />} index={3} />
			</div>

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
