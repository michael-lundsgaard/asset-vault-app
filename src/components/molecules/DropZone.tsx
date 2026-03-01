'use client';

import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export function DropZone({
	onFiles,
	loading,
	className,
}: {
	onFiles: (files: File[]) => void;
	loading?: boolean;
	className?: string;
}) {
	const onDrop = useCallback(
		(accepted: File[]) => {
			if (accepted.length) onFiles(accepted);
		},
		[onFiles]
	);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true, disabled: loading });

	return (
		<div
			{...getRootProps()}
			className={cn(
				'flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-200 p-10 select-none',
				isDragActive
					? 'border-brand-400 bg-brand-400/5 scale-[1.01]'
					: 'border-[var(--border)] hover:border-[var(--muted)] bg-[var(--surface)]',
				loading && 'opacity-50 cursor-not-allowed',
				className
			)}
		>
			<input {...getInputProps()} />
			<div
				className={cn(
					'w-14 h-14 rounded-3xl flex items-center justify-center transition-colors',
					isDragActive ? 'bg-brand-400/20 text-brand-400' : 'bg-[var(--card)] text-[var(--subtle)]'
				)}
			>
				<Upload className="w-6 h-6" />
			</div>
			<div className="text-center">
				<p className="text-sm font-semibold text-[var(--text)]">
					{isDragActive ? 'Release to upload' : 'Drop files here'}
				</p>
				<p className="text-xs text-[var(--subtle)] mt-1">or click to browse</p>
			</div>
		</div>
	);
}
