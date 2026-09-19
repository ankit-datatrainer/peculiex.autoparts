import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { CartProvider } from '../context/CartContext';
import StorefrontChrome from '../components/StorefrontChrome';
import { fetchProducts } from '../lib/api';

export const viewport = {
  themeColor: '#c62828',
  width: 'device-width',
  initialScale: 1
};

export const metadata = {
  title: 'MotoMart India | Bike & Scooter Parts',
  description: 'MotoMart India — bike and scooter parts, riding gear and accessories with fitment guidance.',
  icons: {
    icon: [
      { url: '/assets/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/assets/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: '/assets/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
};

export default async function RootLayout({ children }) {
  const products = await fetchProducts();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#c62828" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <CartProvider>
            {children}
            <StorefrontChrome products={products} />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
