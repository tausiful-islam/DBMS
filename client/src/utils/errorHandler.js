// Global error handler to suppress non-critical errors during initial load
let isInitialLoad = true;
let initialLoadTimer = null;

// After 3 seconds, consider initial load complete
const setInitialLoadComplete = () => {
  if (initialLoadTimer) {
    clearTimeout(initialLoadTimer);
  }
  initialLoadTimer = setTimeout(() => {
    isInitialLoad = false;
  }, 3000);
};

// Call this when the app starts
export const initializeErrorHandler = () => {
  setInitialLoadComplete();
  
  // Override console.error during initial load to suppress non-critical errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const errorMessage = args.join(' ').toLowerCase();
    
    // During initial load, suppress common non-critical errors
    if (isInitialLoad) {
      const suppressedErrorPatterns = [
        'network error',
        'failed to fetch',
        'cors',
        'connection refused',
        'timeout',
        'unauthorized',
        'auth',
        'login'
      ];
      
      const shouldSuppress = suppressedErrorPatterns.some(pattern => 
        errorMessage.includes(pattern)
      );
      
      if (shouldSuppress) {
        return; // Suppress the error during initial load
      }
    }
    
    // Allow all errors to show after initial load, or critical errors always
    originalConsoleError.apply(console, args);
  };
};

// Reset error handler after successful auth
export const resetErrorHandler = () => {
  isInitialLoad = false;
  if (initialLoadTimer) {
    clearTimeout(initialLoadTimer);
  }
};
