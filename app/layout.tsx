import type {Metadata} from 'next';
import './globals.css'; // Global styles
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Todo Dashboard',
  description: 'A responsive todo dashboard with pagination and local state management.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-gray-50 min-h-screen font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
