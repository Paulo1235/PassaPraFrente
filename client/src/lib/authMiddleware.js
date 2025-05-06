const authMiddleware = (store) => (next) => (action) => {
  const state = store.getState();
  
  // Helper function to check if the token is expired
  const isTokenExpired = (token) => {
    const decodedToken = decodeToken(token);
    if (!decodedToken) return true;

    // Verifique a data de expiração do token (se houver)
    const expirationDate = decodedToken.exp * 1000; // exp vem em segundos, então multiplicamos por 1000 para obter milissegundos
    return Date.now() > expirationDate;
  };

  // Verificar token e garantir que não esteja expirado antes de permitir ações protegidas
  const token = getTokenFromCookies();
  if (token && isTokenExpired(token)) {
    console.warn("Token expirado. Redirecionando para a página de login...");
    store.dispatch({ type: "auth/logout" }); // Logout se o token expirou
    return; // Impede a execução de ações protegidas
  }

  // Se o token não estiver expirado, continua a ação
  return next(action);
};

export default authMiddleware;
