export function generateStaticParams() {
  return [
    { skill: "listening" },
    { skill: "reading" },
    { skill: "writing" },
    { skill: "speaking" },
  ];
}

export default function SkillLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
