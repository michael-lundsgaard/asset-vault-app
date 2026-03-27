import type { Session, User } from '@supabase/supabase-js';

// ─── Auth ──────────────────────────────────────────────────────────────────────
export type { Session, User };

export interface AuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
}

// ─── Assets ───────────────────────────────────────────────────────────────────
export type AssetStatus = 'Pending' | 'Active' | 'Failed' | 'Deleted';

// ─── UI ───────────────────────────────────────────────────────────────────────
export type ViewMode = 'grid' | 'list';
export type ThemeMode = 'light' | 'dark';

export interface InfiniteScrollProps {
	hasNextPage?: boolean;
	isFetchingNextPage?: boolean;
	onLoadMore: () => void;
}

export interface UploadState {
	id: string;
	file: File;
	displayName: string;
	assetId?: string;
	presignedUrl?: string;
	progress: number;
	status: 'idle' | 'initiating' | 'uploading' | 'confirming' | 'done' | 'error';
	error?: string;
}
