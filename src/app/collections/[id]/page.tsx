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
import { Input } from '@/components/atoms/Input';
import { BackButton } from '@/components/molecules/BackButton';
import { PageError } from '@/components/molecules/PageError';
import { ViewToggle } from '@/components/molecules/ViewToggle';
import { AddAssetModal } from '@/components/organisms/AddAssetModal';
import { AssetGrid } from '@/components/organisms/AssetGrid';
import { Header } from '@/components/organisms/Header';
import { AppLayout } from '@/components/templates/AppLayout';
import { useUIStore } from '@/store/uiStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CollectionDetailPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const qc = useQueryClient();
	const { viewMode, setViewMode } = useUIStore();

	const [showAddAssets, setShowAddAssets] = useState(false);
	const [editing, setEditing] = useState(false);
	const [editName, setEditName] = useState('');
	const [editDesc, setEditDesc] = useState('');

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
			setEditing(false);
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

	function startEdit() {
		setEditName(collection?.name ?? '');
		setEditDesc(collection?.description ?? '');
		setEditing(true);
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

			{editing ? (
				<div className="flex items-start gap-3 mb-8">
					<div className="flex-1 space-y-2">
						<Input
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
							placeholder="Collection name"
							autoFocus
							className="text-2xl"
						/>
						<Input
							value={editDesc}
							onChange={(e) => setEditDesc(e.target.value)}
							placeholder="Description (optional)"
						/>
					</div>
					<div className="flex gap-2 pt-1">
						<Button
							size="sm"
							disabled={!editName.trim()}
							loading={isUpdating}
							onClick={() =>
								updateCollection({
									path: { id },
									body: { name: editName.trim(), description: editDesc.trim() || null },
								})
							}
						>
							<Check className="w-4 h-4" />
							Save
						</Button>
						<Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
							<X className="w-4 h-4" />
						</Button>
					</div>
				</div>
			) : (
				<Header
					title={isLoading ? '…' : (collection?.name ?? 'Collection')}
					subtitle={subtitle}
					actions={
						<div className="flex items-center gap-2">
							<Button variant="ghost" onClick={startEdit} disabled={isLoading}>
								<Pencil className="w-4 h-4" />
								Edit
							</Button>
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
						</div>
					}
				/>
			)}

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
