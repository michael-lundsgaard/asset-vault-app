import { AuthGuard } from '@/components/templates/AuthGuard';
import { Providers } from '@/components/templates/Providers';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
	title: 'AssetVault',
	description: 'Media asset management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<Providers>
					<AuthGuard>{children}</AuthGuard>
					<Toaster
						position="bottom-right"
						toastOptions={{
							style: {
								background: 'var(--card)',
								color: 'var(--text)',
								border: '1px solid var(--border)',
								borderRadius: '1rem',
								fontSize: '13px',
								fontFamily: 'var(--font-body)',
							},
						}}
					/>
				</Providers>
			</body>
		</html>
	);
}
