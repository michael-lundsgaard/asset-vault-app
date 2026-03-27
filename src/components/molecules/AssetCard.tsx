'use client';

import type { AssetResponse } from '@/api/generated/types.gen';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { FileIcon } from '@/components/atoms/FileIcon';
import { AddToCollectionMenu } from '@/components/organisms/AddToCollectionMenu';
import { formatBytes, formatDate, truncate } from '@/lib/utils';
import { AssetStatus } from '@/types';
import { m } from 'framer-motion';
import { FolderPlus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

export function AssetCard({
	asset,
	index = 0,
	onDelete,
	allowAddToCollection = true,
}: {
	asset: AssetResponse;
	index?: number;
	onDelete?: (id: string) => void;
	allowAddToCollection?: boolean;
}) {
	const [showMenu, setShowMenu] = useState(false);
	const menuButtonRef = useRef<HTMLButtonElement>(null);

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
			className="group relative"
		>
			<Link
				href={`/assets/${asset.id}`}
				className="block card overflow-hidden hover:scale-[1.02] transition-transform duration-200"
			>
				{/* Thumbnail */}
				<div className="relative h-44 bg-[var(--surface)] flex items-center justify-center overflow-hidden">
					<div className="flex flex-col items-center gap-2 opacity-30">
						<FileIcon contentType={asset.contentType} className="w-12 h-12" />
						<span className="text-xs font-mono">{asset.contentType.split('/')[1]?.toUpperCase()}</span>
					</div>

					<div className="absolute bottom-3 left-3">
						<Badge status={asset.status as AssetStatus}>{asset.status}</Badge>
					</div>
				</div>

				{/* Info */}
				<div className="p-4 space-y-2">
					<p className="text-sm font-semibold text-[var(--text)] leading-snug">
						{truncate(asset.fileName, 30)}
					</p>
					<div className="flex items-center justify-between text-xs font-mono text-[var(--subtle)]">
						<span>{formatBytes(asset.sizeBytes)}</span>
						<span>{formatDate(asset.createdAt)}</span>
					</div>
				</div>
			</Link>

			{allowAddToCollection && (
				<Button
					ref={menuButtonRef}
					variant="ghost"
					size="sm"
					aria-label="Add to collection"
					aria-expanded={showMenu}
					aria-haspopup="listbox"
					className={`absolute top-2 ${onDelete ? 'right-9' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity z-10`}
					onClick={(e) => {
						e.preventDefault();
						setShowMenu((v) => !v);
					}}
				>
					<FolderPlus className="w-3.5 h-3.5" />
				</Button>
			)}

			{onDelete && (
				<Button
					variant="ghost"
					size="sm"
					className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
					onClick={(e) => {
						e.preventDefault();
						onDelete(asset.id);
					}}
				>
					<Trash2 className="w-3.5 h-3.5" />
				</Button>
			)}

			{showMenu && (
				<AddToCollectionMenu assetId={asset.id} anchorRef={menuButtonRef} onClose={() => setShowMenu(false)} />
			)}
		</m.div>
	);
}
