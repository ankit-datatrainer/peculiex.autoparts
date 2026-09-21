import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { CartProvider } from '../context/CartContext';
import StorefrontChrome from '../components/StorefrontChrome';
import { fetchProducts } from '../lib/api';
import { getLanguage } from '../lib/i18n-server';

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
  const [products, language] = await Promise.all([fetchProducts(), getLanguage()]);

  // Karla and Work Sans carry no Devanagari or Gujarati glyphs, so those
  // readers would otherwise be at the mercy of whatever the device happens to
  // have installed. Load the matching Noto face only when it is needed.
  const indicFont =
    language === 'gu'
      ? 'https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400..700&display=swap'
      : language === 'hi' || language === 'mr'
        ? 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400..700&display=swap'
        : null;

  return (
    <html lang={language}>
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
        {indicFont && <link href={indicFont} rel="stylesheet" />}
      </head>
      <body>
        <LanguageProvider initialLanguage={language}>
          <CartProvider>
            {children}
            <StorefrontChrome products={products} />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
