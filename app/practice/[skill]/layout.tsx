export function generateStaticParams() {
  return [
    { skill: "reading" },
    { skill: "listening" },
  ];
}

export default function PracticeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
