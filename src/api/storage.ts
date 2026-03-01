export const uploadToS3 = (presignedUrl: string, file: File, onProgress?: (percent: number) => void): Promise<void> => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		if (onProgress) {
			xhr.upload.addEventListener('progress', (event) => {
				if (event.lengthComputable) {
					onProgress(Math.round((event.loaded / event.total) * 100));
				}
			});
		}

		xhr.addEventListener('load', () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve();
			} else {
				reject(new Error(`S3 upload failed: ${xhr.statusText}`));
			}
		});

		xhr.addEventListener('error', () => reject(new Error('S3 upload failed: network error')));
		xhr.addEventListener('abort', () => reject(new Error('S3 upload aborted')));

		xhr.open('PUT', presignedUrl);
		xhr.setRequestHeader('Content-Type', file.type);
		xhr.send(file);
	});
};

export const downloadFromS3 = async (
	presignedUrl: string,
	fileName: string,
	onProgress?: (percent: number) => void
): Promise<void> => {
	const response = await fetch(presignedUrl);
	if (!response.ok) throw new Error(`S3 download failed: ${response.statusText}`);

	const contentLength = response.headers.get('Content-Length');
	const total = contentLength ? parseInt(contentLength, 10) : null;
	const reader = response.body?.getReader();
	if (!reader) throw new Error('S3 download failed: no response body');

	const chunks: Uint8Array<ArrayBuffer>[] = [];
	let loaded = 0;

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
		loaded += value.byteLength;
		if (onProgress && total) {
			onProgress(Math.round((loaded / total) * 100));
		}
	}

	const blob = new Blob(chunks);
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = fileName;
	anchor.click();
	URL.revokeObjectURL(url);
};
