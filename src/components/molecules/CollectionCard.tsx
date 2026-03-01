'use client';

import type { CollectionResponse } from '@/api/generated/types.gen';
import { Button } from '@/components/atoms/Button';
import { formatDate, truncate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FolderOpen, Trash2 } from 'lucide-react';
import Link from 'next/link';

export function CollectionCard({
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
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
			className="group relative"
		>
			<Link
				href={`/collections/${collection.id}`}
				className="block card overflow-hidden hover:scale-[1.02] transition-transform duration-200"
			>
				<div className="relative h-36 bg-[var(--surface)] flex items-center justify-center overflow-hidden">
					<div className="flex flex-col items-center gap-2 opacity-30">
						<FolderOpen className="w-12 h-12" />
					</div>
					<div className="absolute bottom-3 right-3 bg-[var(--card)] border border-[var(--border)] rounded-xl px-2.5 py-1 text-xs font-mono text-[var(--subtle)]">
						{assetCount} {assetCount === 1 ? 'asset' : 'assets'}
					</div>
				</div>

				<div className="p-4 space-y-1.5">
					<p className="text-sm font-semibold text-[var(--text)] leading-snug">
						{truncate(collection.name, 30)}
					</p>
					{collection.description && (
						<p className="text-xs text-[var(--subtle)] leading-snug">
							{truncate(collection.description, 48)}
						</p>
					)}
					<p className="text-xs font-mono text-[var(--muted)]">{formatDate(collection.createdAt)}</p>
				</div>
			</Link>

			{onDelete && (
				<Button
					variant="ghost"
					size="sm"
					className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
					onClick={(e) => {
						e.preventDefault();
						onDelete(collection.id);
					}}
				>
					<Trash2 className="w-3.5 h-3.5" />
				</Button>
			)}
		</motion.div>
	);
}
