import LoginForm from "@/features/auth/components/LoginForm";
import { useInventory } from "@/store/InventoryContext";

function LoginPage() {
  const { isBootstrapping } = useInventory();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 shadow-glow backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-ember">Store Access</p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.08em] text-white sm:text-5xl">
            GameOn Associate Login
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
            Sign in with your store associate credentials to open the POS terminal, process
            transactions, and collect payments across console, game, and accessory inventory.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard title="Terminal Mode" value="Retail POS" />
            <StatCard title="Access Level" value="Associate" />
            <StatCard title="Theme" value="Midnight Crimson" />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#090b10]/95 p-8 shadow-glow backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-ember">Sign In</p>
          <LoginForm isLoading={isBootstrapping} />
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-black/25 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-white/50">{title}</p>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
    </div>
  );
}

export default LoginPage;
