/**
 * Amazon Clone - Root Layout
 * 
 * Provides the global HTML structure, fonts, and base styling.
 * Now including the Global Cart Context, Dynamic Header, and Footer.
 */

import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Amazon.in: Online Shopping, Low Prices',
  description: 'Amazon Clone project built with Next.js, Node.js, and PostgreSQL.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main style={{ minHeight: '80vh' }}>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
