import { Sidebar } from '@/components/organisms/Sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen overflow-hidden bg-[var(--bg)]">
			<Sidebar />
			<main className="flex-1 overflow-y-auto [scrollbar-gutter:stable]">
				<div className="max-w-7xl mx-auto px-7 py-8">{children}</div>
			</main>
		</div>
	);
}
