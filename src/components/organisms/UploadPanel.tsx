'use client';

import { Button } from '@/components/atoms/Button';
import { DropZone } from '@/components/molecules/DropZone';
import { UploadProgress } from '@/components/molecules/UploadProgress';
import { useUploadAsset } from '@/hooks/useUploadAsset';
import { X } from 'lucide-react';
import { useState } from 'react';

const BUSY_STATUSES = new Set(['initiating', 'uploading', 'confirming']);

type QueueItem = { file: File; name: string };

function stemFrom(fileName: string): string {
	const dot = fileName.lastIndexOf('.');
	return dot > 0 ? fileName.slice(0, dot) : fileName;
}

function extFrom(fileName: string): string {
	const dot = fileName.lastIndexOf('.');
	return dot > 0 ? fileName.slice(dot) : '';
}

export function UploadPanel({ onClose }: { onClose?: () => void }) {
	const { upload, uploadStates, reset } = useUploadAsset();
	const [queue, setQueue] = useState<QueueItem[]>([]);
	const busy = uploadStates.some((s) => BUSY_STATUSES.has(s.status));

	const handleUploadAll = () => {
		const items = queue;
		setQueue([]);
		Promise.allSettled(items.map((item) => upload(item.file, item.name + extFrom(item.file.name))));
	};

	const updateName = (index: number, name: string) => {
		setQueue((q) => q.map((item, i) => (i === index ? { ...item, name } : item)));
	};

	return (
		<div className="card p-6 space-y-5">
			<div className="flex items-center justify-between">
				<h2 className="font-display text-xl font-semibold text-[var(--text)]">Upload Assets</h2>
				{onClose && (
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X className="w-4 h-4" />
					</Button>
				)}
			</div>

			<DropZone
				onFiles={(f) => setQueue((q) => [...q, ...f.map((file) => ({ file, name: stemFrom(file.name) }))])}
				loading={busy}
			/>

			{queue.length > 0 && (
				<div className="space-y-2">
					<p className="text-xs font-semibold text-[var(--subtle)] uppercase tracking-wider">
						Queue · {queue.length}
					</p>
					{queue.map((item, i) => (
						<div
							key={i}
							className="flex items-center gap-2 rounded-2xl border border-[var(--border)] px-4 py-2.5 bg-[var(--surface)]"
						>
							<input
								value={item.name}
								onChange={(e) => updateName(i, e.target.value)}
								disabled={busy}
								className="flex-1 min-w-0 bg-transparent text-sm font-medium text-[var(--text)] outline-none placeholder:text-[var(--subtle)] disabled:opacity-50"
							/>
							{extFrom(item.file.name) && (
								<span className="text-sm font-mono text-[var(--subtle)] shrink-0">
									{extFrom(item.file.name)}
								</span>
							)}
							<button
								onClick={() => setQueue((q) => q.filter((_, qi) => qi !== i))}
								className="ml-1 text-[var(--subtle)] hover:text-[var(--text)] shrink-0"
							>
								<X className="w-3.5 h-3.5" />
							</button>
						</div>
					))}
					<Button onClick={handleUploadAll} loading={busy} className="w-full">
						Upload {queue.length} file{queue.length !== 1 ? 's' : ''}
					</Button>
				</div>
			)}

			{uploadStates.length > 0 && (
				<div className="space-y-2">
					<p className="text-xs font-semibold text-[var(--subtle)] uppercase tracking-wider">
						Uploads · {uploadStates.length}
					</p>
					{uploadStates.map((state) => (
						<UploadProgress key={state.id} state={state} />
					))}
					{uploadStates.every((s) => s.status === 'done' || s.status === 'error') && (
						<Button variant="ghost" size="sm" onClick={reset} className="w-full">
							Clear all
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
