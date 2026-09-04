import Link from "next/link";
import { Logo } from "../_components/Logo";
import { Constellation } from "../_components/Constellation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grain relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#00004d] text-white">
      <div
        aria-hidden
        className="absolute inset-0 -z-30 bg-[radial-gradient(115%_90%_at_50%_-15%,#3d1d7a_0%,#1a0f3e_42%,#00004d_78%)]"
      />
      <div
        aria-hidden
        className="absolute -left-40 top-10 -z-20 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/20 blur-[130px]"
      />
      <div
        aria-hidden
        className="absolute -right-40 top-40 -z-20 h-[32rem] w-[32rem] rounded-full bg-[#f3cfc6]/15 blur-[130px]"
      />
      <Constellation className="absolute inset-0 -z-10 h-full w-full opacity-50" />

      <header className="px-5 py-5 sm:px-8">
        <Link href="/" className="inline-flex items-center">
          <Logo className="h-9" />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="px-5 py-6 text-center text-xs text-slate-400 sm:px-8">
        Purposeful &middot; Transparent &middot; Beneficial to society
      </footer>
    </div>
  );
}
