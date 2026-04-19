import { useState, useCallback } from 'react';

/**
 * Custom hook for managing loading states with async operations
 * @returns {Object} - { isLoading, error, execute, setError }
 */
const useAsync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFunction) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, execute, setError };
};

export default useAsync;