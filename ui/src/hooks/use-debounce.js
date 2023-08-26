import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (value.length >= 3) {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [value, delay]);

  return debouncedValue;
}
