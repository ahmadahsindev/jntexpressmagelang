import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-20 flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
