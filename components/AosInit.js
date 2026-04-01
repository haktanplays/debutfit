'use client';
import { useEffect } from 'react';
import AOS from 'aos';

export default function AosInit() {
  useEffect(() => {
    AOS.init({ once: true, offset: 100 });
  }, []);
  return null;
}
