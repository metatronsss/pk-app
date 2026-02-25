'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setLoading(true);
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message ?? '卡片驗證失敗');
        setLoading(false);
        return;
      }
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment?success=1`,
          payment_method_data: {
            billing_details: { name: 'Cardholder' },
          },
        },
      });
      const confirmError = 'error' in result ? result.error : null;
      const setupIntent = 'setupIntent' in result ? result.setupIntent : null;
      if (confirmError) {
        setError(confirmError.message ?? '綁定失敗');
        setLoading(false);
        return;
      }
      const pmId = setupIntent && typeof setupIntent === 'object' && 'payment_method' in setupIntent
        ? (setupIntent.payment_method as string)
        : null;
      if (pmId) {
        await fetch('/api/stripe/attach-payment-method', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentMethodId: pmId }),
        });
        window.location.href = '/payment?success=1';
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '綁定失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary w-full"
      >
        {loading ? '處理中…' : '綁定信用卡'}
      </button>
    </form>
  );
}

export default function PaymentForm() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/stripe/setup-intent', { method: 'POST' })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setError(data.message ?? '無法取得 Setup Intent');
      })
      .catch(() => setError('連線失敗'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="card p-6 text-center text-slate-500">載入中…</div>;
  }
  if (error || !clientSecret) {
    return (
      <div className="card rounded-lg border-red-200 bg-red-50 p-4 text-red-700">
        {error ?? '無法載入付款表單'}
      </div>
    );
  }

  const options = { clientSecret, appearance: { theme: 'stripe' as const } };

  return (
    stripePromise && (
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    )
  );
}
