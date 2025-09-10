export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full">
      {/* Public layout wrapper - header and footer are handled by root layout */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
