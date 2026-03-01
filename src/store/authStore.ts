import { supabase } from '@/api/supabase';
import type { Session, User } from '@/types';
import { create } from 'zustand';

interface AuthStore {
	user: User | null;
	session: Session | null;
	loading: boolean;

	// Actions
	setSession: (session: Session | null) => void;
	signInWithEmail: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	init: () => Promise<() => void>; // returns unsubscribe fn
}

export const useAuthStore = create<AuthStore>((set) => ({
	user: null,
	session: null,
	loading: true,

	setSession: (session) => set({ session, user: session?.user ?? null, loading: false }),

	signInWithEmail: async (email, password) => {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) throw new Error(error.message);
	},

	signOut: async () => {
		await supabase.auth.signOut();
		set({ user: null, session: null });
	},

	init: async () => {
		// Hydrate from existing session
		const { data } = await supabase.auth.getSession();

		set({
			session: data.session,
			user: data.session?.user ?? null,
			loading: false,
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			set({ session, user: session?.user ?? null, loading: false });
		});

		return () => subscription.unsubscribe();
	},
}));
