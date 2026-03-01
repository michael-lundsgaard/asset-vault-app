import clsx, { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}

export function formatBytes(bytes: number, decimals = 1): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function formatDate(iso: string): string {
	return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

export function isImageType(ct: string) {
	return ct.startsWith('image/');
}
export function isVideoType(ct: string) {
	return ct.startsWith('video/');
}

export function truncate(s: string, n: number) {
	return s.length <= n ? s : s.slice(0, n) + '…';
}
