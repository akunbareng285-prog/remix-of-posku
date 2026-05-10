import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="border-b-2 border-foreground bg-accent sticky top-0 z-10">
      <div className="px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display uppercase tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm font-medium text-foreground/70 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}