export const uploadToS3 = (
	presignedUrl: string,
	file: File,
	onProgress?: (percent: number) => void
): Promise<void> => {
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
