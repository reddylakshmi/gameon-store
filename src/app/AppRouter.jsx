import { useAuth } from "@/store/AuthContext";
import AppShell from "@/layouts/AppShell";
import LoginPage from "@/pages/LoginPage";
import PosPage from "@/pages/PosPage";

function AppRouter() {
  const { associate } = useAuth();

  return (
    <AppShell>
      {associate ? <PosPage /> : <LoginPage />}
    </AppShell>
  );
}

export default AppRouter;
