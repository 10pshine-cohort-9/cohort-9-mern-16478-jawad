const DashboardPage = () => {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
        Phase 1
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
        Dashboard foundation ready
      </h1>

      <p className="mt-3 max-w-2xl leading-7 text-slate-500">
        Sidebar, topbar, routing, reusable UI components and the application
        shell are configured successfully.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {["Authentication UI", "Notes Dashboard", "Rich-text Editor"].map(
          (item) => (
            <article
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="font-semibold text-slate-900">{item}</p>

              <p className="mt-2 text-sm text-slate-500">
                Scheduled for an upcoming frontend phase.
              </p>
            </article>
          ),
        )}
      </div>
    </section>
  );
};

export default DashboardPage;
