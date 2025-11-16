import { useEffect } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

/**
 * Custom hook for handling keyboard shortcuts
 * @param shortcuts - Object mapping keys to callback functions
 * @param enabled - Whether shortcuts are enabled
 */
export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcuts,
  enabled: boolean = true
): void => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const callback = shortcuts[key];

      if (callback) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
};
