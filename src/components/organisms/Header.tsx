interface HeaderProps {
	title: string;
	subtitle?: string;
	actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
	return (
		<div className="flex items-start justify-between gap-4 mb-8">
			<div>
				<h1 className="font-display text-3xl font-semibold text-[var(--text)] tracking-tight">{title}</h1>
				{subtitle && <p className="text-sm text-[var(--subtle)] mt-1">{subtitle}</p>}
			</div>
			{actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
		</div>
	);
}
