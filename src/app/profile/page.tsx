'use client';

import { assetsGetByOwnerOptions, collectionsGetByOwnerOptions } from '@/api/generated/@tanstack/react-query.gen';
import { ContentToggle } from '@/components/molecules/ContentToggle';
import { StatCard } from '@/components/molecules/StatCard';
import { ViewToggle } from '@/components/molecules/ViewToggle';
import { AssetGrid } from '@/components/organisms/AssetGrid';
import { CollectionGrid } from '@/components/organisms/CollectionGrid';
import { Header } from '@/components/organisms/Header';
import { AppLayout } from '@/components/templates/AppLayout';
import { formatBytes } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, FolderOpen, HardDrive, Layers } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
	const { viewMode, setViewMode } = useUIStore();
	const [contentTab, setContentTab] = useState<'assets' | 'collections'>('assets');
	const { user } = useAuthStore();

	const { data: pagedAssets, isLoading: isLoadingAssets } = useQuery({
		...assetsGetByOwnerOptions({ path: { userId: user?.id ?? '' }, query: { pageSize: 50 } }),
		enabled: !!user?.id,
	});

	const { data: pagedCollections, isLoading: isLoadingCollections } = useQuery({
		...collectionsGetByOwnerOptions({
			path: { userId: user?.id ?? '' },
			query: { pageSize: 50, expand: 'assets' },
		}),
		enabled: !!user?.id,
	});

	const assets = pagedAssets?.items ?? [];
	const collections = pagedCollections?.items ?? [];
	const activeAssets = assets.filter((a) => a.status === 'Active').length;
	const totalStorage = assets.reduce((sum, a) => sum + a.sizeBytes, 0);
	const memberSince = user?.created_at ? new Date(user.created_at).getFullYear() : null;
	const avatarLetter = user?.email?.[0]?.toUpperCase() ?? '?';

	return (
		<AppLayout>
			<Header
				title="Profile"
				subtitle={
					pagedAssets && pagedCollections
						? `${pagedAssets.total} assets · ${pagedCollections.total} collections`
						: undefined
				}
			/>

			<div className="flex items-center gap-5 mb-8 p-5 card">
				<div className="w-14 h-14 rounded-2xl bg-brand-400/15 text-brand-400 flex items-center justify-center font-display text-2xl font-semibold flex-shrink-0">
					{avatarLetter}
				</div>
				<div className="min-w-0">
					<p className="text-[var(--text)] font-semibold truncate">{user?.email ?? 'Unknown'}</p>
					{memberSince && <p className="text-xs text-[var(--subtle)] mt-0.5">Member since {memberSince}</p>}
				</div>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<StatCard
					label="Total Assets"
					value={pagedAssets?.total ?? 0}
					icon={<Layers className="w-4 h-4" />}
					index={0}
				/>
				<StatCard
					label="Collections"
					value={pagedCollections?.total ?? 0}
					icon={<FolderOpen className="w-4 h-4" />}
					index={1}
				/>
				<StatCard label="Active" value={activeAssets} icon={<CheckCircle2 className="w-4 h-4" />} index={2} />
				<StatCard
					label="Storage"
					value={formatBytes(totalStorage)}
					icon={<HardDrive className="w-4 h-4" />}
					index={3}
				/>
			</div>

			<div className="flex items-center justify-between gap-4 mb-5">
				<ContentToggle value={contentTab} onChange={setContentTab} />
				<ViewToggle value={viewMode} onChange={setViewMode} />
			</div>

			{contentTab === 'assets' ? (
				<AssetGrid assets={assets} isLoading={isLoadingAssets} viewMode={viewMode} />
			) : (
				<CollectionGrid collections={collections} isLoading={isLoadingCollections} viewMode={viewMode} />
			)}
		</AppLayout>
	);
}
