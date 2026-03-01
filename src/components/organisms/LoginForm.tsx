'use client';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { Lock, Mail, Vault } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const { signInWithEmail } = useAuthStore();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await signInWithEmail(email, password);
			router.push('/');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 24, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
			className="card p-8 w-full max-w-sm space-y-6"
		>
			{/* Logo */}
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-2xl bg-brand-400 flex items-center justify-center shadow-glow">
					<Vault className="w-5 h-5 text-white" />
				</div>
				<div>
					<h1 className="font-display text-xl font-semibold text-[var(--text)]">AssetVault</h1>
					<p className="text-xs text-[var(--subtle)]">Welcome back</p>
				</div>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					label="Email"
					type="email"
					icon={<Mail className="w-4 h-4" />}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@example.com"
					required
					autoComplete="email"
				/>
				<Input
					label="Password"
					type="password"
					icon={<Lock className="w-4 h-4" />}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="••••••••"
					required
					autoComplete="current-password"
				/>

				<Button type="submit" loading={loading} size="lg" className="w-full mt-2">
					Sign in
				</Button>
			</form>
		</motion.div>
	);
}
