import '@/styles/globals.css';
import 'aos/dist/aos.css';
import AosInit from '@/components/AosInit';
import ModalProvider from '@/components/ModalProvider';

export const metadata = {
  title: 'DebutFit Club | Sınırlarını Zorla',
  description: 'Premium fitness ve yaşam tarzı merkezi',
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
