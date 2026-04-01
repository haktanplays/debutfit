'use client';
import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export default function ModalProvider({ children }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ loginOpen, setLoginOpen, quoteOpen, setQuoteOpen, trialOpen, setTrialOpen }}>
      {children}
    </ModalContext.Provider>
  );
}
