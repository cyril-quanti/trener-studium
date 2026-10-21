import { NavLink, Outlet } from "react-router-dom";
import { GraduationCap, House, Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { to: "/", label: "Domů", icon: House, end: true },
  { to: "/zkouska", label: "Zkouška", icon: GraduationCap, end: false },
  { to: "/nastaveni", label: "Nastavení", icon: Settings, end: false },
];

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
        <span className="text-sm font-semibold tracking-tight text-text">Trenér – studium</span>
        <ThemeToggle />
      </header>

      <nav
        aria-label="Hlavní navigace"
        className="hidden w-60 shrink-0 flex-col gap-1 border-r border-border p-4 md:flex"
      >
        <span className="mb-4 px-2 text-sm font-semibold tracking-tight text-text">Trenér – studium</span>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150 ${
                isActive ? "bg-surface-raised text-accent" : "text-text-muted hover:bg-surface-raised hover:text-text"
              }`
            }
          >
            <Icon size={18} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
        <div className="mt-auto pt-4">
          <ThemeToggle />
        </div>
      </nav>

      <main id="main-content" className="w-full flex-1 px-4 pb-24 pt-6 sm:px-6 md:px-8 md:pb-10 md:pt-8">
        <div className="mx-auto w-full max-w-4xl">
          <Outlet />
        </div>
      </main>

      <nav
        aria-label="Hlavní navigace"
        className="fixed inset-x-0 bottom-0 z-10 flex border-t border-border bg-surface-raised/95 backdrop-blur md:hidden"
      >
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-h-11 flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors duration-150 ${
                isActive ? "text-accent" : "text-text-muted"
              }`
            }
          >
            <Icon size={20} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
