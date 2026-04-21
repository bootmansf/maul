"use client";

import { useEffect, useState } from "react";

function calc(target: number) {
  const distance = Math.max(0, target - Date.now());
  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;
  return {
    days: Math.floor(distance / day),
    hours: Math.floor((distance % day) / hour),
    minutes: Math.floor((distance % hour) / minute),
    seconds: Math.floor((distance % minute) / 1000),
    done: distance === 0,
  };
}

export function Countdown({ targetIso }: { targetIso: string }) {
  const target = new Date(targetIso).getTime();
  const [state, setState] = useState(() => calc(target));

  useEffect(() => {
    setState(calc(target));
    const id = setInterval(() => setState(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (state.done) {
    return (
      <div className="event-item-header1_countdown">
        <p className="heading-style-h4 text-color-gold">
          The weekend is here!
        </p>
      </div>
    );
  }

  return (
    <div className="event-item-header1_countdown">
      <Cell n={state.days} label="Days" />
      <div className="divider-vertical" />
      <Cell n={state.hours} label="Hours" />
      <div className="divider-vertical" />
      <Cell n={state.minutes} label="Mins" />
      <div className="divider-vertical" />
      <Cell n={state.seconds} label="Secs" />
    </div>
  );
}

function Cell({ n, label }: { n: number; label: string }) {
  return (
    <div className="event-item-header1_number-wrapper">
      <div className="heading-style-h3">{n}</div>
      <div>{label}</div>
    </div>
  );
}
