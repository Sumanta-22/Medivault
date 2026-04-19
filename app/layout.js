import './globals.css';
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
    title: 'MediVault — Your Medical Records, Secured',
    description:
        'Digitally store, organize, and access your medical history with emergency support. Secure, modern, and always accessible.',
    keywords: 'medical records, health vault, emergency medical, digital health',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
            <body className="bg-surface-950 text-surface-50 antialiased">
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
