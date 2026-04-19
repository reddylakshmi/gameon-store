import { currency } from "@/utils/formatters/currency";
import { useCart } from "@/store/CartContext";
import { useInventory } from "@/store/InventoryContext";

function InventoryGrid() {
  const { filteredItems } = useInventory();
  const { addToCart } = useCart();

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {filteredItems.map((item) => {
        const stockLabel = item.stockCount > 0 ? `${item.stockCount} in stock` : "Out of stock";
        return (
          <article
            key={item.id}
            className="group rounded-[1.7rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 transition hover:-translate-y-1 hover:border-ember/50 hover:shadow-glow"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ember">{item.category}</p>
                <h3 className="mt-2 text-xl font-bold text-white">{item.name}</h3>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                #{item.id}
              </div>
            </div>

            <div className="space-y-2 text-sm text-white/75">
              <p>
                <span className="font-semibold text-white">Platform:</span> {item.platform}
              </p>
              <p>
                <span className="font-semibold text-white">Availability:</span> {stockLabel}
              </p>
              <p className="pt-1 text-3xl font-black text-white">{currency.format(item.price)}</p>
            </div>

            <button
              type="button"
              className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-crimson px-4 text-base font-bold uppercase tracking-[0.18em] text-white transition hover:bg-ember disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
              onClick={() => addToCart(item)}
              disabled={item.stockCount === 0}
            >
              {item.stockCount === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </article>
        );
      })}
    </section>
  );
}

export default InventoryGrid;
