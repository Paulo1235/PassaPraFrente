const authMiddleware = (store) => (next) => (action) => {
    const state = store.getState();
    
    // If trying to access protected routes without authentication, prevent it
    if (action.type.includes("PROTECTED_") && !state.auth.isAuthenticated) {
      console.warn("Unauthorized access attempt. Redirecting...");
      return;
    }
  
    return next(action);
  };
  
  export default authMiddleware;