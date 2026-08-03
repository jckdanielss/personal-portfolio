import { useEffect, useState } from "react";
import { VIEWS_GET_URL } from "./viewCounter.js";

export function useViewCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(VIEWS_GET_URL)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setCount(Number(d.value ?? 0)); })
      .catch(() => { if (!cancelled) setCount(null); });
    return () => { cancelled = true; };
  }, []);

  return count;
}
