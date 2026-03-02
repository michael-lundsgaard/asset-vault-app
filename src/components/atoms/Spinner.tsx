export function Spinner() {
	return (
		<div className="flex items-center justify-center h-screen bg-[var(--bg)]">
			<div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
		</div>
	);
}
