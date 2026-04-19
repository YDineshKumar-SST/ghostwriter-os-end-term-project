import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for detecting clicks outside an element
 * @param {Function} handler - Callback when click outside is detected
 * @returns {React.RefObject} - Ref to attach to the element
 */
const useClickOutside = (handler) => {
  const ref = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
};

export default useClickOutside;