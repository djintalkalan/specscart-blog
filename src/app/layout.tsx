import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Toast from '@/components/Toast';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthProvider from '@/provider/AuthProvider';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const cookieStore = await cookies()
  const theme = (cookieStore.get('theme')?.value || 'light') as 'light' | 'dark';

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider initialTheme={theme}>
            <Header />
            <div className='flex flex-1 flex-col' >
              {children}
            </div>
            <Footer />
            <Toast />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
