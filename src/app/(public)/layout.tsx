import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black text-white antialiased">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
