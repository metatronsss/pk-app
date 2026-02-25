'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessHandler() {
  const searchParams = useSearchParams();
  const setupIntent = searchParams.get('setup_intent');
  const success = searchParams.get('success');

  useEffect(() => {
    if (success === '1' && setupIntent) {
      fetch('/api/stripe/complete-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupIntentId: setupIntent }),
      }).then(() => {
        window.location.replace('/payment');
      });
    }
  }, [success, setupIntent]);

  return null;
}
