'use client';

import { assetsGetByIdOptions, assetsGetDownloadUrlOptions } from '@/api/generated/@tanstack/react-query.gen';
import { assetsGetDownloadUrl } from '@/api/generated/sdk.gen';
import { downloadFromS3 } from '@/api/storage';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { FileIcon } from '@/components/atoms/FileIcon';
import { Skeleton } from '@/components/atoms/Skeleton';
import { BackButton } from '@/components/molecules/BackButton';
import { PageError } from '@/components/molecules/PageError';
import { Header } from '@/components/organisms/Header';
import { AppLayout } from '@/components/templates/AppLayout';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { m } from 'framer-motion';
import { Download, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const fadeUp = {
	hidden: { opacity: 0, y: 16 },
	show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' } }),
};

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-4 py-3">
			<span className="text-xs font-medium text-[var(--subtle)] uppercase tracking-wider shrink-0">{label}</span>
			<span className="text-sm text-[var(--text)] text-right">{children}</span>
		</div>
	);
}

function PreviewPanel({ contentType, streamUrl }: { contentType: string; streamUrl?: string }) {
	const baseCard =
		'w-full rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center';

	if (contentType.startsWith('image/') && streamUrl) {
		return (
			<Image
				src={streamUrl}
				alt="Asset preview"
				unoptimized
				width={0}
				height={0}
				sizes="100vw"
				className="w-full max-h-[520px] object-contain rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]"
				style={{ height: 'auto' }}
			/>
		);
	}

	if (contentType.startsWith('video/') && streamUrl) {
		return <video controls src={streamUrl} className={cn(baseCard, 'max-h-[520px]')} />;
	}

	if (contentType.startsWith('audio/') && streamUrl) {
		return (
			<div className={cn(baseCard, 'h-36 flex-col gap-4')}>
				<FileIcon contentType={contentType} className="w-10 h-10 text-[var(--muted)]" />
				<audio controls src={streamUrl} className="w-full max-w-sm" />
			</div>
		);
	}

	return (
		<div className={cn(baseCard, 'h-64 flex-col gap-3')}>
			<FileIcon contentType={contentType} className="w-16 h-16 text-[var(--muted)]" />
			<span className="text-xs font-mono text-[var(--subtle)]">{contentType}</span>
		</div>
	);
}

export default function AssetDetailPage() {
	const { id } = useParams<{ id: string }>();
	const [_, setDownloadProgress] = useState<number | null>(null);

	const {
		data: asset,
		isLoading,
		isError,
	} = useQuery(assetsGetByIdOptions({ path: { id }, query: { expand: 'collections' } }));

	const isStreamable = asset
		? asset.contentType.startsWith('image/') ||
			asset.contentType.startsWith('video/') ||
			asset.contentType.startsWith('audio/')
		: false;

	const { data: downloadData } = useQuery({
		...assetsGetDownloadUrlOptions({ path: { id } }),
		enabled: !!asset && isStreamable,
	});

	const streamUrl = downloadData?.presignedUrl;

	async function handleDownload() {
		if (!asset) return;
		try {
			let url = streamUrl;

			if (!url) {
				const { data, error } = await assetsGetDownloadUrl({ path: { id } });
				if (error || !data?.presignedUrl) throw new Error('Could not get download URL');
				url = data.presignedUrl;
			}

			setDownloadProgress(0);
			await downloadFromS3(url, asset.fileName, setDownloadProgress);
			toast.success('Download complete');
		} catch {
			toast.error('Download failed');
		} finally {
			setDownloadProgress(null);
		}
	}

	const formattedDate = asset
		? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(asset.createdAt))
		: null;

	if (isError) {
		return (
			<AppLayout>
				<PageError message="Asset not found" />
			</AppLayout>
		);
	}

	return (
		<AppLayout>
			<BackButton label="Assets" />
			<Header
				title={isLoading ? '…' : (asset?.fileName ?? 'Asset')}
				subtitle={isLoading ? undefined : asset?.sizeFormatted}
				actions={
					<div className="flex items-center gap-2">
						<Button onClick={handleDownload} disabled={isLoading}>
							<Download className="w-4 h-4" />
							Download
						</Button>
					</div>
				}
			/>

			<div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
				{/* Preview */}
				<m.div custom={0} variants={fadeUp} initial="hidden" animate="show">
					{isLoading ? (
						<Skeleton className="w-full h-64 rounded-2xl" />
					) : (
						<PreviewPanel contentType={asset!.contentType} streamUrl={streamUrl} />
					)}
				</m.div>

				{/* Sidebar */}
				<m.div custom={1} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col gap-4">
					{/* Metadata card */}
					<div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 divide-y divide-[var(--border)]">
						{isLoading ? (
							<>
								{[...Array(5)].map((_, i) => (
									<div key={i} className="flex justify-between items-center py-3 gap-4">
										<Skeleton className="h-3 w-16 rounded" />
										<Skeleton className="h-3 w-28 rounded" />
									</div>
								))}
							</>
						) : (
							<>
								<DetailRow label="Status">
									<Badge status={asset!.status as any}>{asset!.status}</Badge>
								</DetailRow>
								<DetailRow label="Type">
									<span className="font-mono text-xs">{asset!.contentType}</span>
								</DetailRow>
								<DetailRow label="Size">{asset!.sizeFormatted}</DetailRow>
								<DetailRow label="Uploaded">{formattedDate}</DetailRow>
								<DetailRow label="ID">
									<span className="font-mono text-xs text-[var(--subtle)] truncate max-w-[140px]">
										{asset!.id}
									</span>
								</DetailRow>
							</>
						)}
					</div>

					{/* Tags */}
					{!isLoading && asset!.tags && asset!.tags.length > 0 && (
						<m.div
							custom={2}
							variants={fadeUp}
							initial="hidden"
							animate="show"
							className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4"
						>
							<p className="text-xs font-medium text-[var(--subtle)] uppercase tracking-wider mb-3">
								Tags
							</p>
							<div className="flex flex-wrap gap-2">
								{asset!.tags.map((tag) => (
									<Badge key={tag}>{tag}</Badge>
								))}
							</div>
						</m.div>
					)}

					{/* Collections */}
					<m.div
						custom={3}
						variants={fadeUp}
						initial="hidden"
						animate="show"
						className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4"
					>
						<p className="text-xs font-medium text-[var(--subtle)] uppercase tracking-wider mb-3">
							Collections
						</p>
						{isLoading ? (
							<div className="flex flex-wrap gap-2">
								{[...Array(3)].map((_, i) => (
									<Skeleton key={i} className="h-7 w-24 rounded-xl" />
								))}
							</div>
						) : asset!.collections && asset!.collections.length > 0 ? (
							<div className="flex flex-wrap gap-2">
								{asset!.collections.map((col) => (
									<Link
										key={col.id}
										href={`/collections/${col.id}`}
										className={cn(
											'inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium',
											'bg-brand-400/10 text-brand-400 border border-brand-400/20',
											'hover:bg-brand-400/20 transition-colors duration-150'
										)}
									>
										<FolderOpen className="w-3 h-3" />
										{col.name}
									</Link>
								))}
							</div>
						) : (
							<p className="text-sm text-[var(--subtle)]">Not in any collection</p>
						)}
					</m.div>
				</m.div>
			</div>
		</AppLayout>
	);
}
