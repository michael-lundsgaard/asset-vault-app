'use client';

import { assetsGetAllQueryKey } from '@/api/generated/@tanstack/react-query.gen';
import { assetsConfirmUpload, assetsInitiateUpload } from '@/api/generated/sdk.gen';
import { uploadToS3 } from '@/api/storage';
import type { UploadState } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function useUploadAsset() {
	const qc = useQueryClient();
	const [uploadStates, setUploadStates] = useState<UploadState[]>([]);

	const updateState = (id: string, patch: Partial<UploadState>) => {
		setUploadStates((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
	};

	const upload = async (file: File) => {
		const tempId = crypto.randomUUID();

		// 1. Register state entry
		setUploadStates((prev) => [
			...prev,
			{ id: tempId, file, assetId: undefined, presignedUrl: undefined, status: 'initiating', progress: 0 },
		]);

		try {
			// 2. Initiate upload — receive assetId + presignedUrl
			const initiateRes = await assetsInitiateUpload({
				body: {
					fileName: file.name,
					contentType: file.type,
					sizeBytes: file.size,
				},
				throwOnError: true,
			});

			const { assetId, presignedUrl } = initiateRes.data;

			// 3. Upload directly to S3 via raw XHR (bypasses apiClient — no base URL, no auth header)
			updateState(tempId, { status: 'uploading', assetId, presignedUrl });
			await uploadToS3(presignedUrl, file, (percent) => {
				updateState(tempId, { progress: percent });
			});

			// 4. Confirm upload
			updateState(tempId, { status: 'confirming', progress: 100 });
			await assetsConfirmUpload({
				path: { id: assetId },
				throwOnError: true,
			});

			// 5. Mark done and refresh the asset list
			updateState(tempId, { status: 'done' });
			await qc.invalidateQueries({ queryKey: assetsGetAllQueryKey() });
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Upload failed';
			updateState(tempId, { status: 'error', error: message });
			toast.error(message);
		}
	};

	const reset = () => setUploadStates([]);

	return { upload, uploadStates, reset };
}
