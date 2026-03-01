import { cn } from '@/lib/utils';
import { AssetStatus } from '@/types';

interface BadgeProps {
	children: React.ReactNode;
	status?: AssetStatus;
	className?: string;
}

const statusMap: Record<AssetStatus, string> = {
	Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
	Pending: 'bg-amber-500/15  text-amber-400  border-amber-500/25',
	Failed: 'bg-red-500/15    text-red-400    border-red-500/25',
	Deleted: 'bg-[var(--border)] text-[var(--subtle)] border-[var(--border)]',
};

export function Badge({ children, status, className }: BadgeProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-0.5 rounded-xl border',
				status ? statusMap[status] : 'bg-[var(--border)] text-[var(--subtle)] border-transparent',
				className
			)}
		>
			{status && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
			{children}
		</span>
	);
}
