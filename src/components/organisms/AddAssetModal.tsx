'use client';

import {
	addAssetToCollectionMutation,
	assetsGetAllOptions,
	collectionsGetByIdQueryKey,
} from '@/api/generated/@tanstack/react-query.gen';
import type { AssetResponse } from '@/api/generated/types.gen';
import { Button } from '@/components/atoms/Button';
import { FileIcon } from '@/components/atoms/FileIcon';
import { Skeleton } from '@/components/atoms/Skeleton';
import { SearchBar } from '@/components/molecules/SearchBar';
import { formatBytes, truncate } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function AddAssetModal({
	collectionId,
	existingAssetIds,
	onClose,
}: {
	collectionId: string;
	existingAssetIds: string[];
	onClose: () => void;
}) {
	const [search, setSearch] = useState('');
	const [adding, setAdding] = useState<Set<string>>(new Set());
	const [added, setAdded] = useState<Set<string>>(new Set(existingAssetIds));
	const qc = useQueryClient();

	const { data, isLoading } = useQuery(assetsGetAllOptions({ query: { search: search || undefined, pageSize: 50 } }));

	const { mutateAsync } = useMutation(addAssetToCollectionMutation());

	async function handleAdd(asset: AssetResponse) {
		if (added.has(asset.id)) return;
		setAdding((s) => new Set(s).add(asset.id));
		try {
			await mutateAsync({ path: { id: collectionId, assetId: asset.id } });
			setAdded((s) => new Set(s).add(asset.id));
			qc.invalidateQueries({
				queryKey: collectionsGetByIdQueryKey({ path: { id: collectionId } }),
			});
		} catch {
			toast.error(`Failed to add ${asset.fileName}`);
		} finally {
			setAdding((s) => {
				const next = new Set(s);
				next.delete(asset.id);
				return next;
			});
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
			<div className="card w-full max-w-2xl flex flex-col max-h-[80vh]">
				<div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
					<h2 className="text-lg font-semibold text-[var(--text)]">Add Assets</h2>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="w-4 h-4" />
					</Button>
				</div>

				<div className="p-4 border-b border-[var(--border)]">
					<SearchBar value={search} onChange={setSearch} />
				</div>

				<div className="flex-1 overflow-y-auto divide-y divide-[var(--border)]">
					{isLoading &&
						Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="flex items-center gap-4 px-5 py-3.5">
								<Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
								<Skeleton className="h-4 flex-1" />
							</div>
						))}

					{data?.items.map((asset) => {
						const isAdded = added.has(asset.id);
						const isAdding = adding.has(asset.id);
						return (
							<button
								key={asset.id}
								onClick={() => handleAdd(asset)}
								disabled={isAdded || isAdding}
								className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--surface)] transition-colors disabled:opacity-60 text-left"
							>
								<div className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
									<FileIcon contentType={asset.contentType} className="w-4 h-4" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-[var(--text)] truncate">
										{truncate(asset.fileName, 50)}
									</p>
									<p className="text-xs font-mono text-[var(--subtle)]">
										{formatBytes(asset.sizeBytes)}
									</p>
								</div>
								{isAdding && (
									<span className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
								)}
								{isAdded && !isAdding && <Check className="w-4 h-4 text-brand-400 flex-shrink-0" />}
							</button>
						);
					})}

					{!isLoading && !data?.items.length && (
						<p className="text-sm text-[var(--subtle)] text-center py-12">No assets found</p>
					)}
				</div>

				<div className="p-4 border-t border-[var(--border)] flex justify-end">
					<Button variant="outline" onClick={onClose}>
						Done
					</Button>
				</div>
			</div>
		</div>
	);
}
