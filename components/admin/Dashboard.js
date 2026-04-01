'use client';
import { useState, useEffect } from 'react';
import { getQuotes, getTrials, getClickCounts } from '@/lib/db';

export default function Dashboard() {
  const [stats, setStats] = useState({ quotes: 0, trials: 0, wp: 0, calls: 0 });

  useEffect(() => {
    async function load() {
      try {
        const quotes = await getQuotes();
        const trials = await getTrials();
        const { calls, whatsapp } = await getClickCounts();
        setStats({ quotes: quotes.length, trials: trials.length, wp: whatsapp, calls });
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  return (
    <>
      <div className="section-header">
        <h2>Sistem Ozeti</h2>
      </div>
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-title">Fiyat Talebi</div>
          <div className="stat-value">{stats.quotes}</div>
        </div>
        <div className="stat-box">
          <div className="stat-title">Ucretsiz Deneme</div>
          <div className="stat-value">{stats.trials}</div>
        </div>
        <div className="stat-box">
          <div className="stat-title">WhatsApp Tiklanma</div>
          <div className="stat-value">{stats.wp}</div>
        </div>
        <div className="stat-box">
          <div className="stat-title">Arama Tiklanma</div>
          <div className="stat-value">{stats.calls}</div>
        </div>
      </div>
    </>
  );
}
