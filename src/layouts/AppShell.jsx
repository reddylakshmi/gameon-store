import Toast from "@/features/feedback/components/SuccessToast";

function AppShell({ children }) {
  return (
    <>
      {children}
      <Toast />
    </>
  );
}

export default AppShell;
