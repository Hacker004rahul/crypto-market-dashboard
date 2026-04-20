export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-neutral-500 dark:text-neutral-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>Data provided by CoinGecko public API. Prices may vary slightly from the website due to refresh timing.</p>
        <p>Built with React, Vite, Tailwind CSS, and browser-persisted product state.</p>
      </div>
    </footer>
  );
}
