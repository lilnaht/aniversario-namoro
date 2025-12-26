"use client";

import { useEffect, useState } from "react";
import { parseDateInput } from "@/lib/date";

type CounterProps = {
  startDate: string | null;
};

type CounterState = {
  years: number;
  months: number;
  days: number;
  hours: number;
};

const emptyCounter: CounterState = {
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
};

function calculateDiff(start: Date, now: Date): CounterState {
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  let hours = now.getHours() - start.getHours();

  if (hours < 0) {
    hours += 24;
    days -= 1;
  }

  if (days < 0) {
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += previousMonth;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours: Math.max(0, hours),
  };
}

export default function RelationshipCounter({ startDate }: CounterProps) {
  const [counter, setCounter] = useState<CounterState>(emptyCounter);

  useEffect(() => {
    if (!startDate) {
      return;
    }

    const parsed = parseDateInput(startDate);
    if (!parsed) {
      return;
    }

    const update = () => setCounter(calculateDiff(parsed, new Date()));
    update();
    const interval = setInterval(update, 60 * 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  if (!startDate) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-white/80 px-6 py-5 text-sm text-rose-500">
        Defina a data de inicio do namoro nas configuracoes.
      </div>
    );
  }

  return (
    <div className="grid gap-3 rounded-3xl border border-rose-100 bg-white/80 px-6 py-5 text-center shadow-sm sm:grid-cols-4">
      <div>
        <p className="text-2xl font-semibold text-rose-700">{counter.years}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-rose-500/80">Anos</p>
      </div>
      <div>
        <p className="text-2xl font-semibold text-rose-700">{counter.months}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-rose-500/80">Meses</p>
      </div>
      <div>
        <p className="text-2xl font-semibold text-rose-700">{counter.days}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-rose-500/80">Dias</p>
      </div>
      <div>
        <p className="text-2xl font-semibold text-rose-700">{counter.hours}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-rose-500/80">Horas</p>
      </div>
    </div>
  );
}
