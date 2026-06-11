import { useEffect, useState } from "react";
import { formatPhoneTime } from "../../utils/formatters";

export function PhoneClock() {
  const [time, setTime] = useState(() => formatPhoneTime(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(formatPhoneTime(new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="phone-clock">{time}</span>;
}
