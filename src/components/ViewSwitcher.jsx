const views = [
  { id: 'market', label: 'Market' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'tools', label: 'Tools' },
  { id: 'insights', label: 'Insights' },
];

export function ViewSwitcher({ activeView, onViewChange }) {
  return (
    <section className="rounded-md border border-stone-200 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="grid gap-2 sm:grid-cols-4">
        {views.map((view) => (
          <button
            className={`rounded-md px-4 py-3 text-sm font-black transition ${
              activeView === view.id
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                : 'text-neutral-500 hover:bg-stone-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
            }`}
            key={view.id}
            onClick={() => onViewChange(view.id)}
            type="button"
          >
            {view.label}
          </button>
        ))}
      </div>
    </section>
  );
}
