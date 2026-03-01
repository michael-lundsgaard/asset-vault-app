'use client';

import { Button } from '@/components/atoms/Button';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { FolderOpen, LayoutDashboard, LogOut, Upload, Vault } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
	{ href: '/', label: 'Dashboard', icon: LayoutDashboard },
	{ href: '/assets', label: 'Assets', icon: Vault },
	{ href: '/collections', label: 'Collections', icon: FolderOpen },
	{ href: '/upload', label: 'Upload', icon: Upload },
];

export function Sidebar() {
	const pathname = usePathname();
	const { user, signOut } = useAuthStore();

	return (
		<aside className="flex flex-col w-60 h-full border-r border-[var(--border)] bg-[var(--surface)]">
			{/* Logo */}
			<div className="px-6 py-6">
				<div className="flex items-center gap-3">
					<div className="w-9 h-9 rounded-2xl bg-brand-400 flex items-center justify-center shadow-glow-sm">
						<Vault className="w-5 h-5 text-white" />
					</div>
					<span className="font-display text-lg font-semibold text-[var(--text)]">AssetVault</span>
				</div>
			</div>

			{/* Nav */}
			<nav className="flex-1 px-3 py-2 space-y-1">
				{nav.map(({ href, label, icon: Icon }) => {
					const active = pathname === href || (href !== '/' && pathname.startsWith(href));
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								'flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150',
								active
									? 'bg-brand-400/15 text-brand-400'
									: 'text-[var(--subtle)] hover:text-[var(--text)] hover:bg-[var(--card)]'
							)}
						>
							<Icon className="w-4 h-4 flex-shrink-0" />
							{label}
						</Link>
					);
				})}
			</nav>

			{/* Footer */}
			<div className="px-4 pb-5 pt-4 border-t border-[var(--border)] space-y-3">
				<ThemeToggle className="w-full justify-start gap-3 px-4 rounded-2xl h-10 border-0 hover:bg-[var(--card)]" />
				{user && (
					<div className="space-y-1">
						<p className="text-xs text-[var(--subtle)] px-4 truncate">{user.email}</p>
						<Button
							variant="ghost"
							size="sm"
							className="w-full justify-start gap-3 px-4"
							onClick={() => signOut()}
						>
							<LogOut className="w-4 h-4" />
							Sign out
						</Button>
					</div>
				)}
			</div>
		</aside>
	);
}
