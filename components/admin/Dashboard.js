'use client';
import { useState, useEffect } from 'react';
import { getJSON, getInt, KEYS } from '@/lib/storage';

export default function Dashboard() {
  const [stats, setStats] = useState({ quotes: 0, trials: 0, wp: 0, calls: 0 });

  useEffect(() => {
    const quotes = getJSON(KEYS.quotes) || [];
    const trials = getJSON(KEYS.trials) || [];
    const wp = getInt(KEYS.wpClicks);
    const calls = getInt(KEYS.callClicks);
    setStats({ quotes: quotes.length, trials: trials.length, wp, calls });
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
