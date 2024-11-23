import { useState, useEffect } from 'react';

export function useClientState<T>(key: string, initialValue: T) {
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      setState(JSON.parse(stored));
    }
    setIsLoading(false);
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    const newValue = value instanceof Function ? value(state) : value;
    setState(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [state, setValue, isLoading] as const;
} 