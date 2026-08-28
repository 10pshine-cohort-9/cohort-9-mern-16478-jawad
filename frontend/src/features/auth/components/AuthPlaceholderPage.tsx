import { Link } from "react-router";

interface AuthPlaceholderPageProps {
  title: string;
  description: string;
  linkLabel?: string;
  linkTo?: string;
}

export const AuthPlaceholderPage = ({
  title,
  description,
  linkLabel,
  linkTo,
}: AuthPlaceholderPageProps) => {
  return (
    <section className="w-full max-w-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
        Frontend foundation
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
        {title}
      </h1>

      <p className="mt-4 max-w-lg leading-7 text-slate-500">{description}</p>

      <div className="mt-10 rounded-2xl border border-violet-100 bg-violet-50 p-6">
        <p className="font-medium text-violet-950">
          This page UI will be implemented in Frontend Phase 2.
        </p>
      </div>

      {linkLabel && linkTo && (
        <Link
          to={linkTo}
          className="mt-8 inline-flex font-semibold text-violet-600 transition hover:text-violet-800"
        >
          {linkLabel}
        </Link>
      )}
    </section>
  );
};
