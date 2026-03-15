import { Providers } from '@/components/templates/Providers';
import { SessionProvider } from '@/components/templates/SessionProvider';
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
			<head>
				{/* Prevents FOUC (Flash of Unstyled Content): apply theme class before first paint */}
				<script
					dangerouslySetInnerHTML={{
						__html: `try{var t=JSON.parse(localStorage.getItem('av-theme')||'{}');var theme=(t.state&&t.state.theme)||'dark';document.documentElement.classList.toggle('dark',theme==='dark')}catch(e){}`,
					}}
				/>
			</head>
			<body className="bg-[var(--bg)]">
				<Providers>
					<SessionProvider>{children}</SessionProvider>
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
