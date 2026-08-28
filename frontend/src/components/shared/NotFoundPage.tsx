import { Link } from "react-router";

export const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8ff] p-6">
      <section className="max-w-lg text-center">
        <p className="text-7xl font-black text-violet-600">404</p>

        <h1 className="mt-4 text-3xl font-bold text-slate-950">
          Page not found
        </h1>

        <p className="mt-3 text-slate-500">
          The page you requested does not exist.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex h-11 items-center rounded-xl bg-violet-600 px-6 font-semibold text-white transition hover:bg-violet-700"
        >
          Return home
        </Link>
      </section>
    </main>
  );
};
