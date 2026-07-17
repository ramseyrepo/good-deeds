import type { Metadata } from "next";
import { SoupedProvider } from "@souped-tools/auth-nextjs/client";
import { getCurrentSession } from "@/lib/auth";
import { AppNav } from "@/components/gd/app-nav";
import { Toaster } from "@/components/ui/sonner";

// Defense-in-depth: authenticated app pages must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Good Deeds",
};

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getCurrentSession();
  return (
    <SoupedProvider user={session}>
      <AppNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
      <Toaster richColors />
    </SoupedProvider>
  );
}
