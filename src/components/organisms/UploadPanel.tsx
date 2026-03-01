'use client';

import { Button } from '@/components/atoms/Button';
import { DropZone } from '@/components/molecules/DropZone';
import { UploadProgress } from '@/components/molecules/UploadProgress';
import { useUploadAsset } from '@/hooks/useAssets';
import { X } from 'lucide-react';
import { useState } from 'react';

const BUSY_STATUSES = new Set(['initiating', 'uploading', 'confirming']);

export function UploadPanel({ onClose }: { onClose?: () => void }) {
	const { upload, uploadStates, reset } = useUploadAsset();
	const [queue, setQueue] = useState<File[]>([]);
	const busy = uploadStates.some((s) => BUSY_STATUSES.has(s.status));

	const handleUploadAll = () => {
		const files = queue;
		setQueue([]);
		Promise.allSettled(files.map((file) => upload(file)));
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

			<DropZone onFiles={(f) => setQueue((q) => [...q, ...f])} loading={busy} />

			{queue.length > 0 && (
				<div className="space-y-2">
					<p className="text-xs font-semibold text-[var(--subtle)] uppercase tracking-wider">
						Queue · {queue.length}
					</p>
					{queue.map((f, i) => (
						<div
							key={i}
							className="flex items-center justify-between rounded-2xl border border-[var(--border)] px-4 py-2.5 bg-[var(--surface)]"
						>
							<span className="text-sm font-medium text-[var(--text)] truncate">{f.name}</span>
							<button
								onClick={() => setQueue((q) => q.filter((_, qi) => qi !== i))}
								className="ml-3 text-[var(--subtle)] hover:text-[var(--text)]"
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
