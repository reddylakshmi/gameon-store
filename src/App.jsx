import ErrorBoundary from "@/components/ErrorBoundary";
import AppStoreProvider from "@/store/AppStoreProvider";
import AppRouter from "@/app/AppRouter";

function App() {
  return (
    <ErrorBoundary>
      <AppStoreProvider>
        <AppRouter />
      </AppStoreProvider>
    </ErrorBoundary>
  );
}

export default App;
