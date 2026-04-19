import { createContext, useCallback, useContext, useState } from "react";
import { loginAssociate } from "@/services/auth/authService";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { showToast } = useToast();
  const [associate, setAssociate] = useState(null);

  const login = useCallback(async (credentials, associates) => {
    const account = await loginAssociate(credentials, associates);
    setAssociate({ id: account.associateId, name: account.name, role: account.role });
    showToast(`Welcome, ${account.name}.`, "success");
  }, [showToast]);

  const logout = useCallback(() => {
    setAssociate(null);
  }, []);

  return (
    <AuthContext.Provider value={{ associate, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
