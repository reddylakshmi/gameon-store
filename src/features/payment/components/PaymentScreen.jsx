import PaymentField from "./PaymentField";
import { currency } from "@/utils/formatters/currency";
import { formatPaymentValue } from "@/utils/formatters/payment";
import { useInventory } from "@/store/InventoryContext";
import { useLoyalty } from "@/store/LoyaltyContext";
import { usePayment } from "@/store/PaymentContext";

function PaymentScreen() {
  const { paymentMethods } = useInventory();
  const { total } = useLoyalty();
  const {
    selectedPaymentMethod,
    selectedPaymentLabel,
    paymentForm,
    paymentErrors,
    isSubmittingPayment,
    isReadingCard,
    readerResponse,
    manualEntryEnabled,
    resetPaymentFlow,
    handlePaymentMethodChange,
    handlePaymentFieldChange,
    startCardReaderFlow,
    enableManualEntry,
    submitPayment
  } = usePayment();

  function updateField(field, value) {
    handlePaymentFieldChange(field, formatPaymentValue(field, value));
  }

  const selectedMethod = paymentMethods.find((m) => m.id === selectedPaymentMethod);

  return (
    <div className="flex h-full min-h-[36rem] flex-col rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-glow backdrop-blur sm:p-6">
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-ember">Payment Screen</p>
          <h2 className="text-2xl font-black uppercase tracking-[0.1em] text-white">
            {selectedPaymentLabel}
          </h2>
        </div>
        <button
          type="button"
          className="h-12 rounded-2xl border border-white/10 px-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:border-ember hover:text-white"
          onClick={resetPaymentFlow}
        >
          Back
        </button>
      </div>

      <div className="mb-4">
        <p className="mb-3 text-xs uppercase tracking-[0.24em] text-white/55">Choose Payment Type</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              className={`rounded-[1.5rem] border p-4 text-left transition ${
                selectedPaymentMethod === method.id
                  ? "border-ember bg-gradient-to-br from-crimson/25 to-white/5 shadow-glow"
                  : "border-white/10 bg-black/20 hover:border-ember/40"
              }`}
              onClick={() => handlePaymentMethodChange(method.id)}
            >
              <p className="font-bold uppercase tracking-[0.1em] text-white">{method.label}</p>
              <p className="mt-2 text-sm text-white/65">{method.hint}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto pr-1 pb-4">
        {paymentErrors.form ? (
          <div className="mb-4 rounded-2xl border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {paymentErrors.form}
          </div>
        ) : null}

        <div className="mb-4 rounded-[1.7rem] border border-ember/30 bg-gradient-to-br from-crimson/20 to-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-ember">Active Method</p>
          <h3 className="mt-2 text-2xl font-bold text-white">{selectedMethod?.label}</h3>
          <p className="mt-2 text-sm text-white/70">{selectedMethod?.hint}</p>
        </div>

        <div className="space-y-4 rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/55">Payment Details</p>
            <h3 className="mt-2 text-xl font-bold text-white">
              {selectedPaymentMethod === "credit" || selectedPaymentMethod === "debit"
                ? "Use the card reader first, then fall back to manual entry only if needed"
                : "Enter customer payment information"}
            </h3>
          </div>

          {(selectedPaymentMethod === "credit" || selectedPaymentMethod === "debit") && (
            <>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-ember">Card Reader</p>
                    <h4 className="mt-2 text-lg font-bold text-white">Tap, insert, or swipe the card</h4>
                    <p className="mt-1 text-sm text-white/65">
                      Click the reader button to simulate authenticated payment data from the terminal.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex h-14 min-w-[14rem] items-center justify-center rounded-2xl border border-ember/40 bg-crimson/20 px-5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-crimson/35 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={startCardReaderFlow}
                    disabled={isReadingCard || Boolean(readerResponse?.token)}
                  >
                    {isReadingCard
                      ? "Reading Card..."
                      : readerResponse?.token
                        ? "Reader Approved"
                        : "Read From Card Reader"}
                  </button>
                </div>

                {readerResponse ? (
                  <div
                    className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                      readerResponse.status === "approved"
                        ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                        : "border-amber-400/40 bg-amber-500/10 text-amber-100"
                    }`}
                  >
                    <p className="font-semibold uppercase tracking-[0.12em]">
                      {readerResponse.status === "approved" ? "Reader Approved" : "Reader Error"}
                    </p>
                    <p className="mt-2">{readerResponse.message}</p>
                    {readerResponse.status === "approved" ? (
                      <p className="mt-2">
                        {readerResponse.brand} ending in {readerResponse.last4} via{" "}
                        {readerResponse.entryMethod} Auth: {readerResponse.authCode}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {!readerResponse?.token ? (
                  <button
                    type="button"
                    className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-ember transition hover:text-white"
                    onClick={enableManualEntry}
                  >
                    Enter Card Manually
                  </button>
                ) : null}
              </div>

              {manualEntryEnabled ? (
                <div className="rounded-[1.5rem] border border-amber-400/30 bg-amber-500/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-amber-200">Manual Fallback</p>
                  <p className="mt-2 text-sm text-amber-100">
                    Reader authentication failed or was skipped. Enter the card details manually.
                  </p>
                </div>
              ) : null}

              {manualEntryEnabled ? (
                <>
                  <PaymentField
                    label="Name On Card"
                    value={paymentForm.nameOnCard}
                    onChange={(value) => updateField("nameOnCard", value)}
                    error={paymentErrors.nameOnCard}
                    placeholder="Alex Mercer"
                  />
                  <PaymentField
                    label="Card Number"
                    value={paymentForm.cardNumber}
                    onChange={(value) => updateField("cardNumber", value)}
                    error={paymentErrors.cardNumber}
                    placeholder="4111 1111 1111 1111"
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <PaymentField
                      label="Expiry"
                      value={paymentForm.expiry}
                      onChange={(value) => updateField("expiry", value)}
                      error={paymentErrors.expiry}
                      placeholder="12/28"
                    />
                    <PaymentField
                      label="CVV"
                      value={paymentForm.cvv}
                      onChange={(value) => updateField("cvv", value)}
                      error={paymentErrors.cvv}
                      placeholder="123"
                    />
                  </div>
                </>
              ) : null}
            </>
          )}

          {selectedPaymentMethod === "bank" && (
            <>
              <PaymentField
                label="Bank Name"
                value={paymentForm.bankName}
                onChange={(value) => updateField("bankName", value)}
                error={paymentErrors.bankName}
                placeholder="Chase"
              />
              <PaymentField
                label="Account Holder"
                value={paymentForm.accountHolder}
                onChange={(value) => updateField("accountHolder", value)}
                error={paymentErrors.accountHolder}
                placeholder="Alex Mercer"
              />
              <PaymentField
                label="Routing Number"
                value={paymentForm.routingNumber}
                onChange={(value) => updateField("routingNumber", value)}
                error={paymentErrors.routingNumber}
                placeholder="021000021"
              />
              <PaymentField
                label="Account Number"
                value={paymentForm.accountNumber}
                onChange={(value) => updateField("accountNumber", value)}
                error={paymentErrors.accountNumber}
                placeholder="000123456789"
              />
            </>
          )}

          {selectedPaymentMethod === "paypal" && (
            <>
              <PaymentField
                label="PayPal Email"
                type="email"
                value={paymentForm.paypalEmail}
                onChange={(value) => updateField("paypalEmail", value)}
                error={paymentErrors.paypalEmail}
                placeholder="customer@example.com"
              />
              <PaymentField
                label="PayPal Password"
                type="password"
                value={paymentForm.paypalPassword}
                onChange={(value) => updateField("paypalPassword", value)}
                error={paymentErrors.paypalPassword}
                placeholder="••••••••"
              />
            </>
          )}

          {selectedPaymentMethod === "afterpay" && (
            <>
              <PaymentField
                label="Customer Full Name"
                value={paymentForm.afterpayName}
                onChange={(value) => updateField("afterpayName", value)}
                error={paymentErrors.afterpayName}
                placeholder="Alex Mercer"
              />
              <PaymentField
                label="Email Address"
                type="email"
                value={paymentForm.afterpayEmail}
                onChange={(value) => updateField("afterpayEmail", value)}
                error={paymentErrors.afterpayEmail}
                placeholder="customer@example.com"
              />
              <PaymentField
                label="Mobile Number"
                value={paymentForm.afterpayPhone}
                onChange={(value) => updateField("afterpayPhone", value)}
                error={paymentErrors.afterpayPhone}
                placeholder="3125551212"
              />
              <PaymentField
                label="Billing ZIP"
                value={paymentForm.afterpayZip}
                onChange={(value) => updateField("afterpayZip", value)}
                error={paymentErrors.afterpayZip}
                placeholder="60601"
              />
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-[1.7rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/55">Amount To Charge</p>
          <p className="mt-2 text-3xl font-black text-white">{currency.format(total)}</p>
          <p className="mt-1 text-sm text-white/60">Submit after reader approval or manual entry.</p>
        </div>
        <button
          type="button"
          className="flex h-16 min-w-[14rem] items-center justify-center rounded-2xl bg-gradient-to-r from-crimson to-ember px-6 text-lg font-black uppercase tracking-[0.16em] text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          onClick={submitPayment}
          disabled={isSubmittingPayment || isReadingCard}
        >
          {isReadingCard ? "Waiting For Reader..." : isSubmittingPayment ? "Processing..." : "Payment"}
        </button>
      </div>
    </div>
  );
}

export default PaymentScreen;
