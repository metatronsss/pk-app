'use client';

import { useState } from 'react';
import { COACH_TYPES, COACH_GENDERS } from '@/lib/coach-dialogue';

type CoachType = keyof typeof COACH_TYPES;
type CoachGender = keyof typeof COACH_GENDERS;

export default function CoachSettings({
  userId,
  coachType,
  coachGender,
}: {
  userId: string;
  coachType: CoachType;
  coachGender: CoachGender;
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
        <label className="block text-sm text-slate-600">類型</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as CoachType)}
          className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
        >
          <option value="family">{COACH_TYPES.family}</option>
          <option value="friend">{COACH_TYPES.friend}</option>
          <option value="lover">{COACH_TYPES.lover}</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-slate-600">性別</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as CoachGender)}
          className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
        >
          <option value="male">{COACH_GENDERS.male}</option>
          <option value="female">{COACH_GENDERS.female}</option>
        </select>
      </div>
      <button
        onClick={save}
        disabled={saving || (type === coachType && gender === coachGender)}
        className="btn-primary text-sm py-1.5 disabled:opacity-50"
      >
        {saving ? '儲存中...' : '儲存設定'}
      </button>
    </div>
  );
}
