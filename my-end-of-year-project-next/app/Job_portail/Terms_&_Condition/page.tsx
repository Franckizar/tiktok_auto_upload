'use client';

import React from 'react';
import CookieConsentBanner from '@/components/Job_portail/Home/components/CookieConsentBanner';

export default function TestCookiePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-800">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">maxxxxxxxxxxxx</h1>
        <p className="text-gray-600 mb-2">You should see the cookie banner at the bottom right.</p>
        <CookieConsentBanner />
      </div>
    </div>
  );
}
