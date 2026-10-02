export function generateStaticParams() {
  return Array.from({ length: 8 }, (_, index) => ({
    week: String(index + 1),
  }));
}

export default function WeekLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
