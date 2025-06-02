export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <nav>Admin Nav Bar</nav>
      <main>{children}</main>
    </section>
  );
}
