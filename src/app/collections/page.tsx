'use client';

import {
	collectionsDeleteMutation,
	collectionsGetAllOptions,
	collectionsGetAllQueryKey,
} from '@/api/generated/@tanstack/react-query.gen';
import { Button } from '@/components/atoms/Button';
import { SearchBar } from '@/components/molecules/SearchBar';
import { ViewToggle } from '@/components/molecules/ViewToggle';
import { CollectionGrid } from '@/components/organisms/CollectionGrid';
import { CreateCollectionModal } from '@/components/organisms/CreateCollectionModal';
import { Header } from '@/components/organisms/Header';
import { AppLayout } from '@/components/templates/AppLayout';
import { useDebounce } from '@/hooks/useDebounce';
import { useUIStore } from '@/store/uiStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FolderPlus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CollectionsPage() {
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search);
	const [showCreate, setShowCreate] = useState(false);
	const { viewMode, setViewMode } = useUIStore();
	const qc = useQueryClient();

	const { data, isLoading } = useQuery(
		collectionsGetAllOptions({ query: { search: debouncedSearch || undefined, pageSize: 50, expand: 'assets' } })
	);

	const { mutate: deleteCollection } = useMutation({
		...collectionsDeleteMutation(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: collectionsGetAllQueryKey() });
			toast.success('Collection deleted');
		},
		onError: () => toast.error('Failed to delete collection'),
	});

	return (
		<AppLayout>
			{showCreate && <CreateCollectionModal onClose={() => setShowCreate(false)} />}

			<Header
				title="Collections"
				subtitle="Manage your asset collections here"
				actions={
					<Button onClick={() => setShowCreate(true)}>
						<FolderPlus className="w-4 h-4" />
						New Collection
					</Button>
				}
			/>

			<div className="flex items-center justify-between gap-4 mb-5">
				<SearchBar value={search} onChange={setSearch} />
				<ViewToggle value={viewMode} onChange={setViewMode} />
			</div>

			<CollectionGrid
				collections={data?.items}
				isLoading={isLoading}
				viewMode={viewMode}
				onDelete={(id) => deleteCollection({ path: { id } })}
			/>
		</AppLayout>
	);
}
