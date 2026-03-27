'use client';

import {
	collectionsDeleteMutation,
	collectionsGetAllQueryKey,
	collectionsGetByIdOptions,
	collectionsGetByIdQueryKey,
	collectionsUpdateMutation,
	removeAssetFromCollectionMutation,
} from '@/api/generated/@tanstack/react-query.gen';
import { Button } from '@/components/atoms/Button';
import { BackButton } from '@/components/molecules/BackButton';
import { PageError } from '@/components/molecules/PageError';
import { ViewToggle } from '@/components/molecules/ViewToggle';
import { AddAssetModal } from '@/components/organisms/AddAssetModal';
import { AssetGrid } from '@/components/organisms/AssetGrid';
import { EditableHeader } from '@/components/organisms/EditableHeader';
import { AppLayout } from '@/components/templates/AppLayout';
import { useUIStore } from '@/store/uiStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CollectionDetailPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const qc = useQueryClient();
	const { viewMode, setViewMode } = useUIStore();

	const [showAddAssets, setShowAddAssets] = useState(false);

	const {
		data: collection,
		isLoading,
		isError,
	} = useQuery(collectionsGetByIdOptions({ path: { id }, query: { expand: 'assets' } }));

	const { mutate: updateCollection, isPending: isUpdating } = useMutation({
		...collectionsUpdateMutation(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: collectionsGetByIdQueryKey({ path: { id } }) });
			toast.success('Collection updated');
		},
		onError: () => toast.error('Failed to update collection'),
	});

	const { mutate: deleteCollection, isPending: isDeleting } = useMutation({
		...collectionsDeleteMutation(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: collectionsGetAllQueryKey() });
			toast.success('Collection deleted');
			router.push('/collections');
		},
		onError: () => toast.error('Failed to delete collection'),
	});

	const { mutate: removeAsset } = useMutation({
		...removeAssetFromCollectionMutation(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: collectionsGetByIdQueryKey({ path: { id } }) });
			toast.success('Asset removed');
		},
		onError: () => toast.error('Failed to remove asset'),
	});

	if (isError) {
		return (
			<AppLayout>
				<PageError message="Collection not found" />
			</AppLayout>
		);
	}

	const assets = collection?.assets ?? [];
	const existingAssetIds = assets.map((a) => a.id);

	const subtitle = isLoading
		? undefined
		: `${assets.length} ${assets.length === 1 ? 'asset' : 'assets'}${collection?.description ? ` · ${collection.description}` : ''}`;

	return (
		<AppLayout>
			{showAddAssets && (
				<AddAssetModal
					collectionId={id}
					existingAssetIds={existingAssetIds}
					onClose={() => setShowAddAssets(false)}
				/>
			)}

			<BackButton label="Collections" />

			<EditableHeader
				title={isLoading ? '…' : (collection?.name ?? 'Collection')}
				subtitle={subtitle}
				disabled={isLoading}
				fields={[
					{ defaultValue: collection?.name ?? '', placeholder: 'Collection name', required: true },
					{ defaultValue: collection?.description ?? '', placeholder: 'Description (optional)' },
				]}
				onSave={(values) =>
					updateCollection({
						path: { id },
						body: { name: values[0].trim(), description: values[1].trim() || null },
					})
				}
				isSaving={isUpdating}
				actions={
					<>
						<Button
							variant="danger"
							loading={isDeleting}
							onClick={() => deleteCollection({ path: { id } })}
						>
							<Trash2 className="w-4 h-4" />
							Delete
						</Button>
						<Button onClick={() => setShowAddAssets(true)}>
							<Plus className="w-4 h-4" />
							Add Assets
						</Button>
					</>
				}
			/>

			<div className="flex items-center justify-end mb-5">
				<ViewToggle value={viewMode} onChange={setViewMode} />
			</div>

			<AssetGrid
				assets={assets}
				isLoading={isLoading}
				viewMode={viewMode}
				onDelete={(assetId) => removeAsset({ path: { id, assetId } })}
			/>
		</AppLayout>
	);
}
