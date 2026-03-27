'use client';

import {
	addAssetToCollectionMutation,
	assetsGetAllQueryKey,
	assetsGetByIdOptions,
	assetsGetByIdQueryKey,
	collectionsCreateMutation,
	collectionsGetAllOptions,
	collectionsGetAllQueryKey,
	removeAssetFromCollectionMutation,
} from '@/api/generated/@tanstack/react-query.gen';
import { Button } from '@/components/atoms/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Plus, Search } from 'lucide-react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import toast from 'react-hot-toast';

interface AddToCollectionMenuProps {
	assetId: string;
	anchorRef: RefObject<HTMLButtonElement>;
	onClose: () => void;
}

export function AddToCollectionMenu({ assetId, anchorRef, onClose }: AddToCollectionMenuProps) {
	const [search, setSearch] = useState('');
	const [showNewCollection, setShowNewCollection] = useState(false);
	const [newName, setNewName] = useState('');
	// Optimistic overrides on top of server data: collectionId → active state
	const [optimistic, setOptimistic] = useState<Map<string, boolean>>(new Map());
	const [pending, setPending] = useState<Set<string>>(new Set());
	const [position, setPosition] = useState({ top: 0, left: 0 });

	const menuRef = useRef<HTMLDivElement>(null);
	const qc = useQueryClient();

	// Prevent background scrolling when menu is open
	useEffect(() => {
		const prevent = (e: Event) => {
			// Allow scrolling inside the menu itself
			if (menuRef.current?.contains(e.target as Node)) return;
			e.preventDefault();
		};
		document.addEventListener('wheel', prevent, { passive: false });
		document.addEventListener('touchmove', prevent, { passive: false });
		return () => {
			document.removeEventListener('wheel', prevent);
			document.removeEventListener('touchmove', prevent);
		};
	}, []);

	// Position the menu based on the anchor button
	useEffect(() => {
		if (!anchorRef.current) return;
		const rect = anchorRef.current.getBoundingClientRect();
		const menuHeight = 320;
		const spaceBelow = window.innerHeight - rect.bottom;
		const top = spaceBelow >= menuHeight ? rect.bottom + 4 : rect.top - menuHeight - 4;
		setPosition({ top, left: rect.left });
	}, [anchorRef]);

	// Close menu on outside click or Escape key
	useEffect(() => {
		function handleMouseDown(e: MouseEvent) {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node) &&
				anchorRef.current &&
				!anchorRef.current.contains(e.target as Node)
			) {
				onClose();
			}
		}

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') onClose();
		}

		document.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [anchorRef, onClose]);

	const { data: allCollections, isLoading: isLoadingCollections } = useQuery(
		collectionsGetAllOptions({ query: { pageSize: 100 } })
	);
	const { data: asset, isLoading: isLoadingAsset } = useQuery(
		assetsGetByIdOptions({ path: { id: assetId }, query: { expand: 'collections' } })
	);
	const { mutateAsync: addAsset } = useMutation(addAssetToCollectionMutation());
	const { mutateAsync: removeAsset } = useMutation(removeAssetFromCollectionMutation());
	const { mutateAsync: createCollection, isPending: isCreating } = useMutation(collectionsCreateMutation());

	const isLoading = isLoadingCollections || isLoadingAsset;
	const serverActive = new Set(asset?.collections?.map((c) => c.id) ?? []);

	function isActive(collectionId: string): boolean {
		if (optimistic.has(collectionId)) return optimistic.get(collectionId)!;
		return serverActive.has(collectionId);
	}

	const filtered = (allCollections?.items ?? []).filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

	async function handleToggle(collectionId: string) {
		if (pending.has(collectionId)) return;
		const active = isActive(collectionId);
		setPending((s) => new Set(s).add(collectionId));
		try {
			if (active) {
				await removeAsset({ path: { id: collectionId, assetId } });
			} else {
				await addAsset({ path: { id: collectionId, assetId } });
			}
			setOptimistic((m) => new Map(m).set(collectionId, !active));
			qc.invalidateQueries({ queryKey: assetsGetAllQueryKey() });
			qc.invalidateQueries({ queryKey: assetsGetByIdQueryKey({ path: { id: assetId } }) });
		} catch {
			toast.error(active ? 'Failed to remove from collection' : 'Failed to add to collection');
		} finally {
			setPending((s) => {
				const next = new Set(s);
				next.delete(collectionId);
				return next;
			});
		}
	}

	async function handleCreateAndAdd() {
		if (!newName.trim()) return;
		try {
			const collection = await createCollection({ body: { name: newName.trim(), description: null } });
			await addAsset({ path: { id: collection.id, assetId } });
			setOptimistic((m) => new Map(m).set(collection.id, true));
			qc.invalidateQueries({ queryKey: collectionsGetAllQueryKey() });
			qc.invalidateQueries({ queryKey: assetsGetAllQueryKey() });
			qc.invalidateQueries({ queryKey: assetsGetByIdQueryKey({ path: { id: assetId } }) });
			setNewName('');
			setShowNewCollection(false);
			toast.success(`Added to "${collection.name}"`);
		} catch {
			toast.error('Failed to create collection');
		}
	}

	return (
		<div
			ref={menuRef}
			style={{ top: position.top, left: position.left }}
			className="fixed z-50 w-60 card shadow-xl border border-[var(--border)] flex flex-col max-h-80 overflow-hidden"
		>
			<div className="p-2 border-b border-[var(--border)] flex items-center gap-2">
				<Search className="w-3.5 h-3.5 text-[var(--subtle)] flex-shrink-0" />
				<input
					autoFocus
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search collections..."
					className="flex-1 bg-transparent text-xs text-[var(--text)] placeholder:text-[var(--subtle)] focus:outline-none"
				/>
			</div>

			<div className="border-b border-[var(--border)]">
				{!showNewCollection ? (
					<button
						onClick={() => setShowNewCollection(true)}
						className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[var(--subtle)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
					>
						<Plus className="w-3.5 h-3.5 flex-shrink-0" />
						New Collection
					</button>
				) : (
					<div className="flex items-center gap-1.5 p-2">
						<input
							autoFocus
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleCreateAndAdd();
								if (e.key === 'Escape') setShowNewCollection(false);
							}}
							placeholder="Collection name..."
							className="flex-1 h-8 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-xs placeholder:text-[var(--subtle)] rounded-xl px-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
						/>
						<Button
							size="sm"
							onClick={handleCreateAndAdd}
							loading={isCreating}
							disabled={!newName.trim()}
							className="h-8 w-8 px-0"
						>
							<Check className="w-3.5 h-3.5" />
						</Button>
					</div>
				)}
			</div>

			<div className="flex-1 overflow-y-auto">
				{isLoading && (
					<div className="flex items-center justify-center py-4">
						<span className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
					</div>
				)}

				{!isLoading && !filtered.length && (
					<p className="text-xs text-[var(--subtle)] text-center py-4">No collections found</p>
				)}

				{!isLoading &&
					filtered.map((collection) => {
						const active = isActive(collection.id);
						const isPending = pending.has(collection.id);
						return (
							<button
								key={collection.id}
								onClick={() => handleToggle(collection.id)}
								disabled={isPending}
								className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface)] transition-colors disabled:opacity-60 text-left"
							>
								<div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
									{isPending ? (
										<span className="w-3.5 h-3.5 border border-brand-400 border-t-transparent rounded-full animate-spin" />
									) : (
										<Check
											className={`w-3.5 h-3.5 transition-opacity ${active ? 'text-brand-400 opacity-100' : 'opacity-0'}`}
										/>
									)}
								</div>
								<span className="truncate text-xs">{collection.name}</span>
							</button>
						);
					})}
			</div>
		</div>
	);
}
