'use client';

import { useState, useCallback } from 'react';

interface ToggleState {
  [blockId: string]: boolean;
}

interface UseToggleStateReturn {
  openToggles: ToggleState;
  toggle: (id: string) => void;
  isOpen: (id: string, defaultOpen?: boolean) => boolean;
}

export const useToggleState = (): UseToggleStateReturn => {
  const [openToggles, setOpenToggles] = useState<ToggleState>({});

  const toggle = useCallback((id: string) => {
    setOpenToggles(prev => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : true
    }));
  }, []);

  const isOpen = useCallback((id: string, defaultOpen = false) => {
    return openToggles[id] !== undefined ? openToggles[id] : defaultOpen;
  }, [openToggles]);

  return { openToggles, toggle, isOpen };
};
