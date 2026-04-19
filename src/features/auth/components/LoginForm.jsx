import useAssociateLoginForm from "../hooks/useAssociateLoginForm";

function LoginForm({ isLoading }) {
  const { associateId, password, errors, isSubmitting, setAssociateId, setPassword, handleSubmit } =
    useAssociateLoginForm();

  return (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
          Associate ID
        </span>
        <input
          type="text"
          value={associateId}
          onChange={(event) => setAssociateId(event.target.value.toUpperCase())}
          placeholder="GS1001"
          className={`h-14 w-full rounded-2xl border bg-coal px-4 text-base text-white outline-none transition ${
            errors.associateId
              ? "border-red-400 focus:border-red-300 focus:ring-2 focus:ring-red-300/30"
              : "border-white/10 focus:border-ember focus:ring-2 focus:ring-ember/30"
          }`}
        />
        {errors.associateId ? (
          <span className="mt-2 block text-sm text-red-300">{errors.associateId}</span>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          className={`h-14 w-full rounded-2xl border bg-coal px-4 text-base text-white outline-none transition ${
            errors.password || errors.form
              ? "border-red-400 focus:border-red-300 focus:ring-2 focus:ring-red-300/30"
              : "border-white/10 focus:border-ember focus:ring-2 focus:ring-ember/30"
          }`}
        />
        {errors.password ? (
          <span className="mt-2 block text-sm text-red-300">{errors.password}</span>
        ) : null}
      </label>

      {errors.form ? <p className="text-sm text-red-300">{errors.form}</p> : null}

      <button
        type="submit"
        disabled={isLoading || isSubmitting}
        className="flex h-16 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-crimson to-ember px-4 text-lg font-black uppercase tracking-[0.16em] text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Loading..." : isSubmitting ? "Signing In..." : "Sign In"}
      </button>

      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-white/75">
        <p className="font-semibold uppercase tracking-[0.18em] text-white">Demo Credentials</p>
        <p className="mt-2">Use credentials from <code className="text-ember">public/mock-data/associates.json</code></p>
      </div>
    </form>
  );
}

export default LoginForm;
