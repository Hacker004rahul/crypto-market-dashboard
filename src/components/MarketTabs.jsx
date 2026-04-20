const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Highlights', value: 'highlights' },
  { label: 'Layer 1', value: 'layer1' },
  { label: 'DeFi', value: 'defi' },
  { label: 'Stablecoins', value: 'stablecoins' },
  { label: 'Meme', value: 'meme' },
  { label: 'AI', value: 'ai' },
];

export function MarketTabs({ activeTab, onTabChange }) {
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-stone-200 pb-3 dark:border-neutral-800">
      {tabs.map((tab) => (
        <button
          className={`shrink-0 rounded-md px-4 py-2 text-sm font-semibold transition ${
            activeTab === tab.value
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200'
              : 'text-neutral-500 hover:bg-stone-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white'
          }`}
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
