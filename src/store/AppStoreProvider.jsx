import { ToastProvider } from "./ToastContext";
import { AuthProvider } from "./AuthContext";
import { InventoryProvider } from "./InventoryContext";
import { CartProvider } from "./CartContext";
import { CustomerProvider } from "./CustomerContext";
import { LoyaltyProvider } from "./LoyaltyContext";
import { HardwareProvider } from "./HardwareContext";
import { PaymentProvider } from "./PaymentContext";

function AppStoreProvider({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <InventoryProvider>
          <CartProvider>
            <CustomerProvider>
              <LoyaltyProvider>
                <HardwareProvider>
                  <PaymentProvider>
                    {children}
                  </PaymentProvider>
                </HardwareProvider>
              </LoyaltyProvider>
            </CustomerProvider>
          </CartProvider>
        </InventoryProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default AppStoreProvider;
