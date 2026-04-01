import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import QuoteModal from '@/components/QuoteModal';
import TrialModal from '@/components/TrialModal';

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <LoginModal />
      <QuoteModal />
      <TrialModal />
      {children}
      <Footer />
    </>
  );
}
