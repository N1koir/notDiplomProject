import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import Header from '@/components/layout/Header';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Knowledge+ | Универсальная платформа образования',
  description: 'Универсальная платформа для обучения и создания образовательных курсов',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <CourseProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Toaster />
              </div>
            </CourseProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}