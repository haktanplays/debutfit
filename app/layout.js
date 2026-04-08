import '@/styles/globals.css';
import 'aos/dist/aos.css';
import AosInit from '@/components/AosInit';
import ModalProvider from '@/components/ModalProvider';

export const metadata = {
  title: {
    default: 'DebutFit Club | Sınırlarını Zorla',
    template: '%s | DebutFit Club',
  },
  description: 'Premium fitness ve yaşam tarzı merkezi. Fitness, yoga, pilates, kick boks ve personal training.',
  keywords: ['fitness', 'spor salonu', 'gym', 'yoga', 'pilates', 'kick boks', 'personal training', 'istanbul', 'atakent', 'debutfit'],
  openGraph: {
    title: 'DebutFit Club | Sınırlarını Zorla',
    description: 'Premium fitness ve yaşam tarzı merkezi',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'DebutFit Club',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ModalProvider>
          <AosInit />
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}
