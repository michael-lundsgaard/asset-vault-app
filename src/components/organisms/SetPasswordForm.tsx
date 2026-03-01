'use client';

import { supabase } from '@/api/supabase';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { KeyRound, Lock, Vault } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function SetPasswordForm() {
	const { user } = useAuthStore();
	const router = useRouter();
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user?.user_metadata?.password_set) {
			router.replace('/');
		}
	}, [user, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password.length < 8) return toast.error('Password must be at least 8 characters');
		if (password !== confirm) return toast.error('Passwords do not match');

		setLoading(true);
		const { error } = await supabase.auth.updateUser({
			password,
			data: { password_set: true },
		});

		if (error) {
			toast.error(error.message);
			setLoading(false);
			return;
		}

		router.replace('/');
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 24, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
			className="card p-8 w-full max-w-sm space-y-6"
		>
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-2xl bg-brand-400 flex items-center justify-center shadow-glow">
					<Vault className="w-5 h-5 text-white" />
				</div>
				<div>
					<h1 className="font-display text-xl font-semibold text-[var(--text)]">AssetVault</h1>
					<p className="text-xs text-[var(--subtle)]">Set your password to continue</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					label="New password"
					type="password"
					icon={<Lock className="w-4 h-4" />}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="••••••••"
					required
					autoComplete="new-password"
				/>
				<Input
					label="Confirm password"
					type="password"
					icon={<KeyRound className="w-4 h-4" />}
					value={confirm}
					onChange={(e) => setConfirm(e.target.value)}
					placeholder="••••••••"
					required
					autoComplete="new-password"
				/>

				<Button type="submit" loading={loading} size="lg" className="w-full mt-2">
					Set password
				</Button>
			</form>
		</motion.div>
	);
}
