'use client';

import type { AssetResponse } from '@/api/generated/types.gen';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { FileIcon } from '@/components/atoms/FileIcon';
import { formatBytes, formatDate, truncate } from '@/lib/utils';
import { AssetStatus } from '@/types';
import { m } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

export function AssetRow({
	asset,
	index = 0,
	onDelete,
}: {
	asset: AssetResponse;
	index?: number;
	onDelete?: (id: string) => void;
}) {
	return (
		<m.div
			initial={{ opacity: 0, x: -10 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.25, delay: index * 0.03 }}
			className="group flex items-center gap-4 px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] transition-colors rounded-2xl"
		>
			<div className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
				<FileIcon contentType={asset.contentType} className="w-4 h-4" />
			</div>

			<Link
				href={`/assets/${asset.id}`}
				className="flex-1 min-w-0 text-sm font-medium text-[var(--text)] hover:text-brand-400 transition-colors truncate"
			>
				{truncate(asset.fileName, 50)}
			</Link>

			<div className="hidden sm:flex items-center gap-6 text-xs font-mono text-[var(--subtle)] flex-shrink-0">
				<span>{formatBytes(asset.sizeBytes)}</span>
				<span>{formatDate(asset.createdAt)}</span>
			</div>

			<Badge status={asset.status as AssetStatus}>{asset.status}</Badge>

			{onDelete && (
				<Button
					variant="ghost"
					size="sm"
					className="opacity-0 group-hover:opacity-100 transition-opacity"
					onClick={(e) => {
						e.preventDefault();
						onDelete(asset.id);
					}}
				>
					<Trash2 className="w-3.5 h-3.5" />
				</Button>
			)}
		</m.div>
	);
}
