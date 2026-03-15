'use client';

import type { CollectionResponse } from '@/api/generated/types.gen';
import { Button } from '@/components/atoms/Button';
import { formatDate, truncate } from '@/lib/utils';
import { m } from 'framer-motion';
import { FolderOpen, Trash2 } from 'lucide-react';
import Link from 'next/link';

export function CollectionRow({
	collection,
	index = 0,
	onDelete,
}: {
	collection: CollectionResponse;
	index?: number;
	onDelete?: (id: string) => void;
}) {
	const assetCount = collection.assets?.length ?? 0;

	return (
		<m.div
			initial={{ opacity: 0, x: -10 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.25, delay: index * 0.03 }}
			className="group flex items-center gap-4 px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] transition-colors rounded-2xl"
		>
			<div className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
				<FolderOpen className="w-4 h-4 text-[var(--subtle)]" />
			</div>

			<Link
				href={`/collections/${collection.id}`}
				className="flex-1 min-w-0 text-sm font-medium text-[var(--text)] hover:text-brand-400 transition-colors truncate"
			>
				{truncate(collection.name, 50)}
			</Link>

			{collection.description && (
				<span className="hidden lg:block text-xs text-[var(--subtle)] truncate max-w-xs">
					{truncate(collection.description, 40)}
				</span>
			)}

			<div className="hidden sm:flex items-center gap-6 text-xs font-mono text-[var(--subtle)] flex-shrink-0">
				<span>
					{assetCount} {assetCount === 1 ? 'asset' : 'assets'}
				</span>
				<span>{formatDate(collection.createdAt)}</span>
			</div>

			{onDelete && (
				<Button
					variant="ghost"
					size="sm"
					className="opacity-0 group-hover:opacity-100 transition-opacity"
					onClick={(e) => {
						e.preventDefault();
						onDelete(collection.id);
					}}
				>
					<Trash2 className="w-3.5 h-3.5" />
				</Button>
			)}
		</m.div>
	);
}
