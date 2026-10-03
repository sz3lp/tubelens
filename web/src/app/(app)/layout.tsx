import { AppNav } from "@/components/AppNav";
import { readCredits } from "@/lib/credits";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const credits = await readCredits();

  return (
    <div className="app-shell">
      <AppNav credits={credits.balance} />
      <div className="min-w-0 px-4 py-6 md:px-8 md:py-8">{children}</div>
    </div>
  );
}
