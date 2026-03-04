'use client';

import { useState } from 'react';
import { t } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

type CoachType = 'family' | 'friend' | 'lover';
type CoachGender = 'male' | 'female';

export default function CoachSettings({
  userId,
  coachType,
  coachGender,
  locale,
}: {
  userId: string;
  coachType: CoachType;
  coachGender: CoachGender;
  locale: Locale;
}) {
  const [type, setType] = useState(coachType);
  const [gender, setGender] = useState(coachGender);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/coach/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coachType: type, coachGender: gender }),
      });
      if (res.ok) window.location.reload();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm text-slate-600">{t('coach.type', locale)}</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as CoachType)}
          className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
        >
          <option value="family">{t('coach.typeFamily', locale)}</option>
          <option value="friend">{t('coach.typeFriend', locale)}</option>
          <option value="lover">{t('coach.typeLover', locale)}</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-slate-600">{t('coach.gender', locale)}</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as CoachGender)}
          className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
        >
          <option value="male">{t('coach.genderMale', locale)}</option>
          <option value="female">{t('coach.genderFemale', locale)}</option>
        </select>
      </div>
      <button
        onClick={save}
        disabled={saving || (type === coachType && gender === coachGender)}
        className="btn-primary text-sm py-1.5 disabled:opacity-50"
      >
        {saving ? t('coach.saving', locale) : t('coach.saveSettings', locale)}
      </button>
    </div>
  );
}
