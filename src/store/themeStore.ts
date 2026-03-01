import type { ThemeMode } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
	theme: ThemeMode;
	toggleTheme: () => void;
	setTheme: (t: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
	persist(
		(set, get) => ({
			theme: 'dark',

			toggleTheme: () => {
				const next = get().theme === 'dark' ? 'light' : 'dark';
				set({ theme: next });
				applyTheme(next);
			},

			setTheme: (t) => {
				set({ theme: t });
				applyTheme(t);
			},
		}),
		{
			name: 'av-theme',
			onRehydrateStorage: () => (state) => {
				if (state) applyTheme(state.theme);
			},
		}
	)
);

function applyTheme(theme: ThemeMode) {
	if (typeof document === 'undefined') return;
	document.documentElement.classList.toggle('dark', theme === 'dark');
}
