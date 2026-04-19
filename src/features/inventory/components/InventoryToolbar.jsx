import { useInventory } from "@/store/InventoryContext";

function InventoryToolbar() {
  const { search, category, platform, categories, platforms, setSearch, setCategory, setPlatform } =
    useInventory();

  return (
    <section className="grid gap-3 md:grid-cols-[1.8fr_1fr_1fr]">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
          Search Inventory
        </span>
        <input
          className="h-14 rounded-2xl border border-white/10 bg-coal px-4 text-base text-white outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/30"
          placeholder="Search games, consoles, accessories..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
          Category
        </span>
        <select
          className="h-14 rounded-2xl border border-white/10 bg-coal px-4 text-base text-white outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/30"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
          Platform
        </span>
        <select
          className="h-14 rounded-2xl border border-white/10 bg-coal px-4 text-base text-white outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/30"
          value={platform}
          onChange={(event) => setPlatform(event.target.value)}
        >
          {platforms.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
    </section>
  );
}

export default InventoryToolbar;
