import type { ViewMode } from '@/types';
import { create } from 'zustand';

interface UIStore {
	viewMode: ViewMode;
	sidebarOpen: boolean;
	uploadPanelOpen: boolean;

	setViewMode: (v: ViewMode) => void;
	toggleSidebar: () => void;
	setUploadPanelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
	viewMode: 'grid',
	sidebarOpen: true,
	uploadPanelOpen: false,

	setViewMode: (viewMode) => set({ viewMode }),
	toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
	setUploadPanelOpen: (uploadPanelOpen) => set({ uploadPanelOpen }),
}));
