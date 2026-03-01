'use client';

import { motion } from 'framer-motion';

export function StatCard({
	label,
	value,
	icon,
	index = 0,
}: {
	label: string;
	value: string | number;
	icon: React.ReactNode;
	index?: number;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 14 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: index * 0.07 }}
			className="card p-5 space-y-3"
		>
			<div className="flex items-center justify-between">
				<span className="text-xs font-semibold text-[var(--subtle)] uppercase tracking-widest">{label}</span>
				<span className="w-8 h-8 flex items-center justify-center rounded-xl bg-brand-400/10 text-brand-400">
					{icon}
				</span>
			</div>
			<p className="font-display text-4xl font-semibold text-[var(--text)] tracking-tight">{value}</p>
		</motion.div>
	);
}
